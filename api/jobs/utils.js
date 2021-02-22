const round_manager = require("../managers/round");
const credential_services = require("../services/credential");
const { completedRound } = require("../helpers/notifications/notifications");
const { customError } = require("../helpers/errorHandler");
const userManager = require("../managers/user");
const cryptoUtil = require("../utils/crypto");
const walletUtil = require("../utils/wallet");
const blockchain = require("../services/blockchain");
const { SC_FEATURES } = require("../utils/other");
const { logError, logSuccess } = require("../helpers/utils");

const {
  WALLET_TARGET_BALANCE,
  WALLET_MIN_BALANCE,
  REFILL_ORIGIN_ACCOUNT,
  REFILL_ORIGIN_ACCOUNT_PK
} = process.env;

const emitRoundCredentialsWrapper = async round => {
  try {
    await credential_services.emitFinishedRoundParticipants(round);
  } catch (error) {
    logError(
      `Job for round ${round._id.toString()} had a failure when try to emmit credentials`
    );
    console.log(error);
  }
};

const handleRoundNumberChange = async roundId => {
  console.log(`Job for round id ${roundId} change number started`);
  // Get round
  const round = await round_manager.findById(roundId);
  let sendCompletedNotification = false;
  // Round must be started
  if (!round) console.error(`Round with id ${roundId} not found!`);
  if (round && round.start) {
    // Which shift are we in?
    const currentShiftIndex = round.shifts.findIndex(
      s => s.status === "current"
    );
    console.log(JSON.stringify(round.shifts));
    console.log(`Current shift index is ${currentShiftIndex}`);
    if (currentShiftIndex != -1) {
      // Mark it as completed
      round.shifts[currentShiftIndex].status = "completed";
      const currentNumber = round.shifts[currentShiftIndex].number;
      const nextShiftIndex = round.shifts.findIndex(
        s => s.number === currentNumber + 1
      );
      // Are we in range?
      console.log(
        `Job for round id ${roundId} changed the status of shift to completed`
      );
      if (nextShiftIndex != -1) {
        // If we are in range, mark the next one as current
        round.shifts[nextShiftIndex].status = "current";

        console.log(
          `Job for round id ${roundId} changed the status of the next shift to current`
        );
      } else {
        sendCompletedNotification = true;
      }
    }
    // Save changes to round
    let updatedRound;
    try {
      updatedRound = await round_manager.save(round);
      if (sendCompletedNotification)
        console.log(`Job for round ${roundId} will send ending notifications`);

      if (updatedRound === null)
        throw new customError("Error changing round number");
    } catch (error) {
      console.error(`Job for round ${roundId} had a failure when saving`);
      console.error(error);
    }

    if (sendCompletedNotification || updatedRound.completed) {
      try {
        await completedRound(round);
      } catch (error) {
        logError(
          `Job for round ${roundId} had a failure when it's sending ending notifications`
        );
        console.log(error);
      }
      emitRoundCredentialsWrapper(round);
    }
    logSuccess(`Job for round ${roundId} ran successfuly`);
  }

  return true;
};

const walletRefill = async () => {
  if (SC_FEATURES) {
    try {
      const users = await userManager.manyWithBalanceBelowOrEqual(
        WALLET_MIN_BALANCE
      );
      const WALLET_TARGET_WEI = blockchain.toWei(WALLET_TARGET_BALANCE);
      const addressIdMap = {};
      const transactions = users.map(async u => {
        try {
          // Users without a private key
          if (!u.walletAddress) {
            const { address, privateKey } = await walletUtil.createWallet();

            const encryptedPK = cryptoUtil.cipher(privateKey);
            const encryptedAddress = cryptoUtil.cipher(address);
            addressIdMap[address] = u._id;
            return {
              walletAddress: encryptedAddress,
              walletPk: encryptedPK,
              address,
              new: true,
              id: u._id
            };
          }
          const address = cryptoUtil.decipher(u.walletAddress);
          addressIdMap[address] = u._id;
          return {
            address,
            id: u._id
          };
        } catch (error) {
          console.log("Failure in creating RBTC tx object for user: ", u);
          return {};
        }
      });
      const finalTransactions = await Promise.all(transactions);
      const performAddtionOfWallets = finalTransactions.map(async t => {
        if (t.new) {
          const result = await userManager.addWallet(
            t.id,
            t.walletAddress,
            t.walletPk
          );
          if (!result)
            return { result, error: `Failed to add wallet to ${t.id}` };
        }
        return { result: true };
      });
      await Promise.all(performAddtionOfWallets);
      try {
        const results = await blockchain.sendManyBalanceTx(
          REFILL_ORIGIN_ACCOUNT,
          REFILL_ORIGIN_ACCOUNT_PK,
          finalTransactions.map(t => t.address),
          WALLET_TARGET_WEI
        );
        const acreditedFinal = await Promise.all(
          results.map(async ({ address, error, success }) => {
            if (!success) return { success: false, error };
            const userId = addressIdMap[address];
            try {
              const user = await userManager.byId(userId);
              if (user) {
                user.lastBalance = await web3.eth.getBalance(address);
                await user.save();
                return { success: true, user: user._id };
              }
              return { success: false, error: "User not found" };
            } catch (error) {
              return { success: false, error: "" };
            }
          })
        );
        console.log(`Resolved ${acreditedFinal.length} transactions`);
      } catch (error) {
        return { result: false, error };
      }
    } catch (error) {
      console.log("Error on WalletRefill Cron: ", error);
    }
  }
};

module.exports = {
  handleRoundNumberChange,
  walletRefill
};
