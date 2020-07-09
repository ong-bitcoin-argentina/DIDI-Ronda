// This file include all the post response actions to be performed.
const walletUtil = require("../utils/wallet");
const crypto = require("../utils/crypto");
const tokens = require("../helpers/tokenGenerator");
const mailing = require("../helpers/emails");
const blockchain = require("./blockchain");
const { SC_FEATURES } = require("../utils/other");
const moment = require("moment");

const user_manager = require("../managers/user");
const round_manager = require("../managers/round");
const participant_manager = require("../managers/participant");
const SMS = require("../helpers/phones");
const { createStartRoundJob } = require("../jobs/jobs");

const {
  inviteRound,
  roundCompletedProcessing,
  participantConfirmed,
  participantRejectedInvitation,
  roundFailedProcessing,
  invitationProcessCompleted,
  invitationProcessFailed,
  participantPaymentConfirmed,
  participantPaymentFailed,
  swappedParticipantAdminConfirmation,
  participantSwappedInRound,
  roundStartProcessing,
  startedRound,
  schedulePayRemember,
  registerUserProcessing,
} = require("../helpers/notifications/notifications");

const {
  REFILL_ORIGIN_ACCOUNT,
  REFILL_ORIGIN_ACCOUNT_PK,
  WALLET_TARGET_BALANCE,
} = process.env;

const getParticipantAddresses = async ids => {
  const users = await user_manager.manyById(ids);
  return users.map(u => crypto.decipher(u.walletAddress));
};

exports.createdRound = async params => {
  const { round, usersOfRound } = params;

  if (SC_FEATURES) {
    try {
      const adminAddress = await walletUtil.getUnencryptedAddress(
        round.admin.walletAddress
      );
      const adminPK = await walletUtil.getUnencryptedAddress(
        round.admin.walletPk
      );

      await blockchain.createRound(round.id, adminAddress);

      const addresses = await getParticipantAddresses(usersOfRound);

      await blockchain.addParticipants(
        round.id,
        addresses,
        adminAddress,
        adminPK
      );
    } catch (error) {
      // TODO: Send failure notification
      console.log("error on ronda SC", error);

      await roundFailedProcessing(round);
      await round_manager.delete(round.id);
      await participant_manager.deleteFromRound(round.id);
      return null;
    }
  }

  try {
    // Update round data
    // SCHEDULE START JOB
    try {
      createStartRoundJob(moment(round.startDate).utc(), round._id);
    } catch (error) {
      console.log("=====================");
      console.log("ERROR createStartRoundJob:", error.message);
      console.log("=====================");
    }
    const foundRound = await round_manager.findById(round._id);
    const { admin } = round;
    // Send push notifications
    round.isConfirmed = true;
    await round.save();
    await roundCompletedProcessing(round);
    inviteRound(foundRound);

    // Send SMSs
    const phones = foundRound.participants
      .map(p => (p.acepted === null ? p.user.phone : null))
      .filter(e => e !== null);
    SMS.sendRoundInvitation(phones, round.name, admin.name);
  } catch (e) {
    console.error(e);
  }
};

exports.acceptOrRejecInvitation = async params => {
  const { round, participant, accepted, username } = params;
  const userNotiParams = [round, participant, accepted];

  if (SC_FEATURES) {
    const participantAddress = crypto.decipher(participant.user.walletAddress);
    const adminAddress = crypto.decipher(round.admin.walletAddress);
    const adminPk = crypto.decipher(round.admin.walletPk);
    try {
      if (round.admin.username === username) {
        // Admin accept participant round invitation (variable participant)
        const callParams = [
          round.id,
          participantAddress,
          adminAddress,
          adminPk,
        ];
        if (accepted) await blockchain.acceptInvitationByAdmin(...callParams);
        if (!accepted) await blockchain.rejectInvitationByAdmin(...callParams);
      } else {
        // Participant accept round invitation (variable participant)
        const participantPk = crypto.decipher(participant.user.walletPk);
        const callParams = [round.id, participantAddress, participantPk];
        if (accepted)
          await blockchain.acceptInvitationToParticipate(...callParams);
        if (!accepted)
          await blockchain.rejectInvitationToParticipate(...callParams);
      }
    } catch (error) {
      await invitationProcessFailed(...userNotiParams);
      return null;
    }
  }

  participant.acepted = accepted;
  participant.hasConfirmedTransaction = true;
  participant.isConfirmingTransaction = false;

  // Update participant
  await participant_manager.save(participant);

  // Send notification to admin
  const adminNotiParams = [round, participant.user.name];
  if (accepted) await participantConfirmed(...adminNotiParams);
  if (!accepted) await participantRejectedInvitation(...adminNotiParams);
  await invitationProcessCompleted(...userNotiParams);
  return null;
};

exports.payNumber = async params => {
  const { round, participant, number } = params;
  if (SC_FEATURES) {
    const amountPaid = round.amount / participant.shiftsQty;
    const payerAddress = crypto.decipher(participant.user.walletAddress);
    const payerPk = crypto.decipher(participant.user.walletPk);
    try {
      await blockchain.makePayment(round.id, amountPaid, payerAddress, payerPk);
    } catch (error) {
      // If this fails, we have to make sure that we restore the participant to a non payment state
      // As well as inform them or the admin
      participant.isReceivingOrMakingPayment = false;
      await participant.save();
      return await participantPaymentFailed(round, participant);
    }
  }

  // Create pay object (Approved if user is admin)
  const payObject = {
    participant: participant,
    approved: participant.user._id.toString() === round.admin._id.toString(),
  };

  // Push payment on round
  round.shifts.find(e => e.number.toString() === number).pays.push(payObject);

  // Save changes to round
  await round_manager.save(round);

  participant.isReceivingOrMakingPayment = false;
  await participant.save();

  // // Send participant notification
  await participantPaymentConfirmed(round, participant);
  return null;
};

exports.swapParticipant = async params => {
  const { round, participant, newUser } = params;
  const commonAdminNotiParams = [round, participant.user.name, newUser.name];
  if (SC_FEATURES) {
    const oldAddress = crypto.decipher(participant.user.walletAddress);
    const newAddress = crypto.decipher(newUser.walletAddress);
    const adminAddress = crypto.decipher(round.admin.walletAddress);
    const adminPk = crypto.decipher(round.admin.walletPk);
    try {
      await blockchain.replaceParticipant(
        round.id,
        oldAddress,
        newAddress,
        adminAddress,
        adminPk
      );
    } catch (error) {
      await swappedParticipantAdminConfirmation(
        ...commonAdminNotiParams,
        false
      );
      participant.isBeingSwapped = false;
      await participant.save();
      return null;
    }
  }

  // Change user in participant, also mark them as not being swapped off
  await participant_manager.updateParticipantUser(participant, newUser);

  await participantSwappedInRound(round, participant);

  // Notification for admin
  await swappedParticipantAdminConfirmation(...commonAdminNotiParams, true);

  return null;
};

exports.startRound = async params => {
  const { round } = params;

  if (SC_FEATURES) {
    const adminData = round.admin;
    const adminAddress = crypto.decipher(adminData.walletAddress);
    const adminPk = crypto.decipher(adminData.walletPk);
    try {
      await blockchain.start(round.id, adminAddress, adminPk);
    } catch (error) {
      await roundStartProcessing(round, true);
      round.isBeingStarted = false;
      await round.save();
      return null;
    }
  }
  // Set start=true
  round.start = true;
  // First shift as current
  round.shifts[0].status = "current";
  round.isBeingStarted = false;
  // Save changes to round
  await round_manager.save(round);
  await roundStartProcessing(round, true);

  // Send notifications to participants
  await startedRound(round);
  // Schedule pays notifications
  schedulePayRemember(round);
  return null;
};

const sendVerificationToken = (username, token) => {
  mailing.sendMail(
    username,
    "La Ronda",
    `Tu codigo de verificacion es: ${token}`
  );

  return token;
};

exports.registerUser = async params => {
  const { nick, username, password, name, token } = params;

  const { address, privateKey } = await walletUtil.createWallet();

  const encryptedAddress = crypto.cipher(address);
  const encryptedPK = crypto.cipher(privateKey);
  let addedBalance = false;
  if (SC_FEATURES) {
    try {
      await blockchain.createSubdomain(nick, address);
    } catch (error) {
      // Send failure notification
      await registerUserProcessing(token, username, false);
      return null;
    }
    try {
      const WALLET_TARGET_WEI = blockchain.toWei(WALLET_TARGET_BALANCE);

      const results = await blockchain.sendManyBalanceTx(
        REFILL_ORIGIN_ACCOUNT,
        REFILL_ORIGIN_ACCOUNT_PK,
        [address],
        WALLET_TARGET_WEI
      );
      await Promise.all(
        results.map(async ({ error, success }) => {
          if (!success) throw error;
          addedBalance = true;
          return { success: true };
        })
      );
    } catch (error) {
      console.log("===================");
      console.log("Error when giving RBTC to new user");
      console.log(error);
      console.log("===================");
    }
  }

  const verifyToken = tokens.generate();

  const user = await user_manager.saveUser(
    username,
    password,
    name,
    token,
    verifyToken,
    nick,
    encryptedAddress,
    encryptedPK
  );
  
  if(addedBalance){ 
    user.lastBalance = WALLET_TARGET_BALANCE;
    await user.save();
  }

  await registerUserProcessing(token, username, true);
  if (user) sendVerificationToken(username, verifyToken);

  return null;
};
