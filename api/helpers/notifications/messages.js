// Categories:
// - Notification: blue
// - Confirmation: green
// - Alert: red
// - Warning: yellow
// - Request: purple

// ADMIN NOTIFICATIONS

// Round - Notification
// not used already
exports.roundAboutToStart = (daysLeft, roundName) => {
  return `En ${daysLeft} días comenzará la ronda ${roundName}. ¿Está todo listo? Recordá que podés iniciarla antes presionando el botón Iniciar.`;
};

// Participant - Confirmation
// code: 'participant-confirmed'
exports.participantConfirmed = participantName => {
  return `Participante ${participantName} ha aceptado ser parte de la ronda.`;
};

// Payment - Warning
// only in jobs
exports.shiftAboutToEnd = (daysLeft, shiftNumber, adminName, endDate) => {
  return `Atención: Quedan ${daysLeft} días para pagar el número ${shiftNumber} al participante ${adminName}. El plazo de pago se vence el ${endDate}.`;
};

// Payment - Warning
// only in jobs
exports.lastDayBeforeExpiration = (roundName, number) => {
  return `Atención: El plazo para el aporte al número ${number} de la ronda ${roundName} vence mañana.`;
};

// Participant - Request
// code: 'shift-requested'
exports.shiftRequested = (participantName, shiftNumber) => {
  return `${participantName} ha solicitado obtener el número ${shiftNumber} de la ronda. Ingresá a la aplicación para aceptar o no esta asignación.`;
};

// USER/PARTICIPANT NOTIFICATIONS
// Participant - Request
// code: 'round-invite'
exports.roundInvite = (roundName, sentBy) => {
  return `Has sido invitado a la ronda ${roundName} por ${sentBy}!. Ingresá para ver mas detalle.`;
};

// Round - Notification
// code: 'round-started'
exports.roundStarted = roundName => {
  return `El administrador ha iniciado la nueva ronda ${roundName}. Ingresá a la aplicación para el seguimiento de la ronda.`;
};

// Round -  Notification
// only in jobs
exports.roundStartedDate = roundName => {
  return `El administrador ha iniciado la nueva ronda ${roundName}. Ingresá a la aplicación para el seguimiento de la ronda.`;
};

// Payments - Alert
// not used already
exports.paymentReminder = roundName => {
  return `Atención: Comenzó el período de pago de la ronda ${roundName} y no está registrado tu pago. Realizá el pago para que su compañero/a pueda recibir su pago en tiempo y forma.`;
};

// Payments - Confirmation
// not used already
exports.shiftPaid = (shiftNumber, nextParticipant) => {
  return `El número ${shiftNumber} ha sido abonado satisfactoriamente. Se ha iniciado un nuevo ciclo de cobro que ha sido asignado a ${nextParticipant}.`;
};

// Payments - Alert
// not used already
exports.participantDidNotPaid = participantName => {
  return `El participante ${participantName} no pagó su número. La deuda tuvo que ser saldada por otro/s particiopante/s.`;
};

// Round - Notification
// code: 'shift-assigned'
exports.shiftAsigned = participantName => {
  return `Se ha asignado un número vacante al participante ${participantName}.`;
};

// Payments - Confirmation
// not used already
exports.shiftRequestAcepted = (shiftNumber, payday) => {
  return `Tu solicitud para tener el numero ${shiftNumber} ha sido aceptada por la administradora. Esto significa que cobrarás la ronda el dia ${payday}.`;
};

// Round - Notification
// code: 'round-completed'
exports.roundCompleted = (roundName, endDate) => {
  return `Se ha completado la ronda ${roundName} el día ${endDate}. Gracias por participar!`;
};

// Payments - Alert
// not used already
exports.garantorRequested = () => {
  return `El participante que promocionaste no ha pagado su cuota este mes, necesitamos que gestiones el cobro de esta cuota y abones al grupo el monto faltante.`;
};

// Payments - Confirmation
// code: 'participant-pay-number'
exports.participantPayNumber = roundName => {
  return `Tu aporte a la ronda ${roundName} fue registrado con éxito!`;
};

// Payments - Request
// code: 'participant-request-payment'
exports.participantRequestPaymentMessage = (roundName, participantName) =>
  `El participante ${participantName} de la ronda ${roundName} esta pidiendo cobrar su numero`;

// Payments  - Request
// code: 'participant-request-admin-accept-payment'
exports.participantRequestAdminToAcceptPaymentMessage = (
  roundName,
  participantName
) =>
  `El participante ${participantName} de la ronda ${roundName} está pidiendo que se acepte su aporte`;

// Participant - Alert
// code: 'participant-rejected'
exports.participantRejected = (roundName, participantName) =>
  `El usuario ${participantName} ha rechazado su invitación para participar de la ronda ${roundName}`;

// Participant - Alert
// code: 'participant-swapped'
exports.participantSwapped = (roundName, adminName) =>
  `El administrador ${adminName} de la ronda ${roundName} te ha reemplazado por otro participante`;

// Round - Alert
// code: 'round-not-started-participant-rejected'
exports.roundNotStartedParticipantRejected = roundName =>
  `La ronda ${roundName} no ha comenzado porque un participante rechazo su invitación, debes reemplazarlo para poder empezar la ronda`;

//  Round - Notification
// code: 'round-confirmation-completed'
exports.roundConfirmationCompleted = roundName =>
  `La ronda ${roundName} se ha procesado! Ya podés entrar desde la sección rondas "Por Iniciar"`;

// Round - Alert
// code: 'round-confirmation-failed'
exports.roundConfirmationFailed = roundName =>
  `La ronda ${roundName} no se ha podido procesar, deberás crearla de nuevo`;

// Participant - Confirmation
// code: 'round-invitation-completed'
exports.roundInvitationCompleted = (roundName, accepted) =>
  `Tu pedido de ${
    accepted ? "aceptar" : "rechazar"
  } la invitación a la ronda ${roundName} fue completado con éxito`;

// Round - Alert
// code: 'round-invitation-failed'
exports.roundInvitationFailed = (roundName, accepted) =>
  `Tu pedido de ${
    accepted ? "aceptar" : "rechazar"
  } la invitacion a la Ronda ${roundName} tuvo un error, deberas intentarlo nuevamente`;

// Payments - Confirmation
// code: 'participant-payment-confirmed'
exports.participantPaymentConfirmed = roundName =>
  `Tu aporte para la ronda ${roundName} fue procesado con éxito!`;

// Payments - Alert
// code: 'participant-payment-failed'
exports.participantPaymentFailed = roundName =>
  `Tu aporte para la ronda ${roundName} no se ha podido procesar. Por favor, inténtalo nuevamente!`;

// Participant - Confirmation
// code: 'admin-swapped-confirmed'
exports.adminSwappedConfirmed = (
  roundName,
  participantName,
  newParticipantName
) =>
  `El participante ${participantName} de la ronda ${roundName} fue reemplazado por ${newParticipantName} con éxito!`;

// Participant - Alert
// code: 'admin-swapped-failed'
exports.adminSwappedFailed = (roundName, participantName, newParticipantName) =>
  `El participante ${participantName} de la ronda ${roundName} no pudo ser reemplazado por ${newParticipantName}. Por favor, inténtalo nuevamente!`;

// Round - Notification
// code: 'round-start-completed'
exports.roundStartCompleted = roundName =>
  `La ronda ${roundName} ya ha iniciado! Podés entrar desde la sección "Activas"`;

// Round - Alert
// code: 'round-start-failed'
exports.roundStartFailed = roundName =>
  `Ups!.. Ocurrió un error al procesar la ronda ${roundName}. Por favor, inténtalo nuevamente!`;

// Participant - Notification
// code: 'register-user-completed'
exports.registerUserCompleted = email =>
  `Se completó el registro del usuario ${email} ya podés inciar sesión`;

// Participant - Alert
// code: 'register-user-failed'
exports.registerUserFailed = email =>
  `El registro del usuario ${email} falló, tenés que intentarlo nuevamente`;

// Payments - Confirmation
// code: 'number-payed-to-user'
exports.numberPayedToUser = (admin, round, number) =>
  `El Administrador ${admin} de la ronda ${round} ha confirmado tu cobro del número ${number}`;

exports.roundListTest = () =>
  "Esta es una notificación de prueba, presioná en ella para ir al listado de Rondas.";
