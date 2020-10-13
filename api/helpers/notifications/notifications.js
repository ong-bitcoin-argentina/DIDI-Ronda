const moment = require("moment");
const { rememberNotifications } = require("../config");
// NOTIFICATIONS
const { createNotification, INTENTS } = require("./config");
const jobs = require("../../jobs/jobs");
const User = require("../../models/user");
const Notification = require("../../models/notification");

const {
  roundInvite,
  roundCompleted,
  roundStarted,
  shiftAsigned,
  shiftRequested,
  participantConfirmed,
  participantPayNumber,
  participantRequestPaymentMessage,
  participantRejected,
  participantSwapped,
  roundNotStartedParticipantRejected,
  roundConfirmationCompleted,
  roundConfirmationFailed,
  roundInvitationCompleted,
  roundInvitationFailed,
  participantPaymentConfirmed,
  participantPaymentFailed,
  adminSwappedConfirmed,
  adminSwappedFailed,
  roundStartCompleted,
  roundStartFailed,
  registerUserCompleted,
  registerUserFailed,
  numberPayedToUser,
  participantRequestAdminToAcceptPaymentMessage,
} = require("./messages");

const APP_TITLE = "Ronda";

async function presistNotification(token, code, body) {
  const user = await User.findByToken(token);
  if (user) {
    await Notification.create({
      code,
      userId: user._id,
      body,
    });
  }
}

async function createAndPersistNotification(tokens, code, body, data) {
  for (const token of tokens) {
    await presistNotification(token, code, body);
  }
  return await createNotification(tokens, APP_TITLE, body, data);
}

exports.inviteRound = async (round) => {
  // Filter accepted === null
  const participants = round.participants.filter((p) => p.acepted === null);
  // Only participants with token
  const tokens = participants.map((p) => p.user.token).filter((t) => t);

  // Create data for redirect
  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: { _id: round._id },
    }),
  };

  const notifications = await createAndPersistNotification(
    tokens,
    "round-invite",
    roundInvite(round.name, round.admin.name),
    data
  );

  return notifications;
};

exports.completedRound = async (round) => {
  // Remove admin
  const participants = round.participants.filter((p) => p.user !== round.admin);

  // Get tokens
  const tokens = participants.map((p) => p.user.token).filter((t) => t);

  const endDate = moment().format("DD/MM/YYYY");

  // Create data for redirect
  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: { _id: round._id },
    }),
  };

  // Send notifications
  const notifications = await createAndPersistNotification(
    tokens,
    "round-completed",
    roundCompleted(round.name, endDate),
    data
  );

  return notifications;
};

exports.startedRound = async (round) => {
  // Only participants with shift assigned
  const idsMap = {};
  round.shifts.forEach((shift) => {
    const id = shift.participant[0].toString();
    idsMap[id] = id;
  });

  const participants = round.participants.filter((p) => {
    // Remove admin
    if (p.user === round.admin) return false;
    const participantId = p._id.toString();
    if (idsMap[participantId]) return true;
    return false;
  });

  // Get tokens
  const tokens = participants.map((p) => p.user.token).filter((t) => t);

  // Create data for redirect
  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: { _id: round._id },
      admin: round.admin.id,
      roundName: round.name,
      intent: INTENTS.ROUND_START,
    }),
  };

  // Send notifications
  const notifications = await createAndPersistNotification(
    tokens,
    "round-started",
    roundStarted(round.name),
    data
  );

  return notifications;
};

exports.startedRoundWithoutShift = async (round) => {
  // Only participants without shift assigned
  const participantsWithShift = round.shifts
    .map((shift) => shift.participant)
    .flat();
  const participants = round.participants.filter((p) => {
    // Remove admin
    if (p.user === round.admin) {
      return false;
    } else {
      return !participantsWithShift.includes(p._id.toString());
    }
  });

  // Get tokens
  const tokens = participants.map((p) => p.user.token).filter((t) => t);

  // Send notifications
  const notifications = await createAndPersistNotification(
    tokens,
    "round-started",
    roundStarted(round.name)
  );

  return notifications;
};

exports.asignedShift = async (round, participantName) => {
  // Remove admin
  const participants = round.participants.filter((p) => p.user !== round.admin);

  // Get tokens
  const tokens = participants.map((p) => p.user.token).filter((t) => t);

  // Create data for redirect
  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: { _id: round._id },
    }),
  };

  // Send notifications
  const notifications = await createAndPersistNotification(
    tokens,
    "shift-assigned",
    shiftAsigned(participantName),
    data
  );

  return notifications;
};

exports.participantRejectedInvitation = async (round, participantName) => {
  // get admin
  const { admin, name } = round;
  const { token } = admin;

  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: { _id: round._id },
    }),
  };

  await createAndPersistNotification(
    [token],
    "participant-rejected",
    participantRejected(name, participantName),
    data
  );

  return null;
};

exports.requestedShiftNotification = async (
  round,
  participantName,
  shiftNumbers
) => {
  // Admin token
  const token = round.admin.token;

  // Array numbers to string - Ex: (3, 4, 7 y 9)
  const stringNumbersJoin = shiftNumbers.join(", ");
  const lastComa = stringNumbersJoin.lastIndexOf(",");
  const stringNumbers =
    stringNumbersJoin.slice(0, lastComa) +
    stringNumbersJoin.slice(lastComa).replace(",", " y");

  // Create data for redirect
  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: { _id: round._id },
    }),
  };

  // Send notifications
  const notifications = await createAndPersistNotification(
    [token],
    "shift-requested",
    shiftRequested(participantName, stringNumbers),
    data
  );

  return notifications;
};

exports.participantConfirmed = async (round, participantName) => {
  // Get admin
  const { admin } = round;

  // Get admin token
  const { token } = admin;

  // Create data for redirect
  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: { _id: round._id },
    }),
  };

  // Send notification
  const notification = await createAndPersistNotification(
    [token],
    "participant-confirmed",
    participantConfirmed(participantName),
    data
  );

  return notification;
};

exports.participantRequestPaymentNoti = async (
  round,
  participant,
  isRequestingPayment = true
) => {
  // Get admin
  const { admin, name } = round;

  // Get admin token
  const { token } = admin;

  // Create data for redirect
  const { user } = participant;
  const currentShift =
    round.shifts.find(
      (shift) => shift.status === "current" || shift.status === "draw"
    ) || round.shifts[round.shifts.length - 1];
  const data = {
    action: JSON.stringify({
      routeName: "NumberPay",
      params: {
        participant: {
          participant,
          id: participant._id,
          name: participant.user.name,
          picture: participant.user.picture,
        },
        shifts: round.shifts,
        roundId: round._id,
        number: currentShift.number,
        initialTab: 0,
      },
    }),
  };
  const msgParams = [name, user.name];
  const message = isRequestingPayment
    ? participantRequestPaymentMessage(...msgParams)
    : participantRequestAdminToAcceptPaymentMessage(...msgParams);
  const code = isRequestingPayment
    ? "participant-request-payment"
    : "participant-request-admin-accept-payment";
  // Send notification
  const notification = await createAndPersistNotification(
    [token],
    code,
    message,
    data
  );

  return notification;
};

exports.participantPayNumberNotification = async (round, participant) => {
  // Get tokens
  const tokens = [participant.user.token];

  // Create data for redirect
  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: { _id: round._id },
    }),
  };

  // Send notifications
  const notifications = await createAndPersistNotification(
    tokens,
    "participant-pay-number",
    participantPayNumber(round.name),
    data
  );

  return notifications;
};

// SCHEDULES
exports.schedulePayRemember = (round) => {
  // Only if recurrence is not daily
  if (round.recurrence !== "d") {
    // Create task schedule for all shifts
    round.shifts.forEach(async (shift) => {
      // Notification date
      const objectSubstract = rememberNotifications[round.recurrence];
      const notificationDate = moment(shift.limitDate).subtract(
        objectSubstract
      );

      // Create task
      return jobs.createPayRememberJob(
        notificationDate,
        round._id,
        shift.number
      );
    });
  }
};

exports.participantSwappedInRound = async (round, participant) => {
  // Get admin
  const { admin, name: roundName } = round;

  // Get admin token
  const { name } = admin;

  // Create data for redirect
  const {
    user: { token },
  } = participant;

  if (!token) return null;

  await createAndPersistNotification(
    [token],
    "participant-swapped",
    participantSwapped(roundName, name),
    null
  );

  return null;
};

exports.roundNotStarted = async (round) => {
  // Get admin
  const { admin, name: roundName } = round;

  // Get admin token
  const { token } = admin;

  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: { _id: round._id },
    }),
  };

  // Send notifications
  await createAndPersistNotification(
    [token],
    "round-not-started-participant-rejected",
    roundNotStartedParticipantRejected(roundName),
    data
  );

  return null;
};

exports.roundCompletedProcessing = async (round) => {
  // Get admin
  const { admin, name: roundName } = round;

  // Get admin token
  const { token } = admin;

  const data = {
    reloadRounds: "true",
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: {
        _id: round._id,
      },
    }),
  };

  // Send notifications
  await createAndPersistNotification(
    [token],
    "round-confirmation-completed",
    roundConfirmationCompleted(roundName),
    data
  );

  return null;
};

exports.roundFailedProcessing = async (round) => {
  // Get admin
  const { admin, name: roundName } = round;

  // Get admin token
  const { token } = admin;

  // Send notifications
  await createAndPersistNotification(
    [token],
    "round-confirmation-failed",
    roundConfirmationFailed(roundName)
  );

  return null;
};

exports.invitationProcessCompleted = async (round, participant, accepted) => {
  // Get admin
  const { user } = participant;

  const data = accepted
    ? {
        action: JSON.stringify({
          routeName: "RoundDetail",
          params: {
            _id: round._id,
          },
        }),
      }
    : null;

  // Get admin token
  const { token } = user;

  // Send notifications
  await createAndPersistNotification(
    [token],
    "round-invitation-completed",
    roundInvitationCompleted(round.name, accepted),
    data
  );

  return null;
};

exports.invitationProcessFailed = async (round, participant, accepted) => {
  // Get admin
  const { user } = participant;

  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: {
        _id: round._id,
      },
    }),
  };

  const { token } = user;

  // Send notifications
  await createAndPersistNotification(
    [token],
    "round-invitation-failed",
    roundInvitationFailed(round.name, accepted),
    data
  );

  return null;
};

exports.participantPaymentConfirmed = async (round, participant) => {
  const { user } = participant;

  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: {
        _id: round._id,
      },
    }),
  };

  const { token } = user;

  // Send notifications
  await createAndPersistNotification(
    [token],
    "participant-payment-confirmed",
    participantPaymentConfirmed(round.name),
    data
  );
};

exports.participantPaymentFailed = async (round, participant) => {
  const { user } = participant;

  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: {
        _id: round._id,
      },
    }),
  };

  const { token } = user;

  // Send notifications
  await createAndPersistNotification(
    [token],
    "participant-payment-failed",
    participantPaymentFailed(round.name),
    data
  );
};

exports.swappedParticipantAdminConfirmation = async (
  round,
  participantName,
  newParticipantName,
  success
) => {
  const { admin, name: roundName } = round;

  // Get admin token
  const { token } = admin;

  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: {
        _id: round._id,
      },
    }),
  };

  const messageParams = [roundName, participantName, newParticipantName];
  const message = success
    ? adminSwappedConfirmed(...messageParams)
    : adminSwappedFailed(...messageParams);
  const code = success ? "admin-swapped-confirmed" : "admin-swapped-failed";

  // Send notifications
  await createAndPersistNotification([token], code, message, data);
};

exports.roundStartProcessing = async (round, success) => {
  const { admin, name: roundName } = round;

  // Get admin token
  const { token } = admin;

  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: {
        _id: round._id,
      },
    }),
  };

  const message = success
    ? roundStartCompleted(roundName)
    : roundStartFailed(roundName);
  const code = success ? "round-start-completed" : "round-start-failed";

  // Send notifications
  await createAndPersistNotification([token], code, message, data);
};

exports.registerUserProcessing = async (token, email, success) => {
  const message = success
    ? registerUserCompleted(email)
    : registerUserFailed(email);
  const code = success ? "register-user-completed" : "register-user-failed";

  // Send notifications
  await createAndPersistNotification([token], code, message, null);
};

exports.numberPayedToUser = async (round, number, participantId) => {
  const { admin, name: roundName } = round;
  const participant = round.participants.find((p) => p.id === participantId);
  // Get admin token
  const { name } = admin;
  const { token } = participant.user;
  const data = {
    action: JSON.stringify({
      routeName: "RoundDetail",
      params: {
        _id: round._id,
      },
    }),
  };

  const message = numberPayedToUser(name, roundName, number);

  // Send notifications
  await createAndPersistNotification(
    [token],
    "number-payed-to-user",
    message,
    data
  );
};
