// ADMIN NOTIFICATIONS
exports.roundAboutToStart = (daysLeft, roundName) => {
  return `En ${daysLeft} días comenzará la Ronda ${roundName}. ¿Está todo listo? Recorda que podes modificar la fecha de inicio o si la quieres iniciar antes, puedes presionar el botón Iniciar.`;
};

exports.participantConfirmed = participantName => {
  return `Participante ${participantName} ha aceptado ser parte de La Ronda.`;
};

exports.shiftAboutToEnd = (daysLeft, shiftNumber, adminName, endDate) => {
  return `Atención: Quedan ${daysLeft} dias para pagar el número ${shiftNumber} al participante ${adminName}. El plazo de pago se vence el ${endDate}.`;
};

exports.shiftRequested = (participantName, shiftNumber) => {
  return `${participantName} ha solicitado obtener el número ${shiftNumber} de La Ronda. Ingrese a la aplicación para aceptar o no esta asignación.`;
};

// USER/PARTICIPANT NOTIFICATIONS
exports.roundInvite = (roundName, sentBy) => {
  return `Ha sido invitado a la Ronda ${roundName} por ${sentBy}. Ingrese para ver mas detalle.`;
};

exports.roundStarted = roundName => {
  return `El administrador ha iniciado la nueva ronda a la que Ud. ha confirmado. Ingrese a la aplicación para hacer el seguimiento sobre la Ronda ${roundName}.`;
};

exports.roundStartedDate = roundName => {
  return `Se ha iniciado la nueva ronda a la que Ud. ha confirmado. Ingrese a la aplicación para hacer el seguimiento sobre la Ronda ${roundName}.`;
};

exports.paymentReminder = roundName => {
  return `Atención: Comenzó el período de pago de La Ronda ${roundName} y no está registrado su pago. Realice el pago para que su compañero o compañera pueda recibir su pago en tiempo y forma.`;
};

exports.shiftPaid = (shiftNumber, nextParticipant) => {
  return `El número ${shiftNumber} ha sido abonado satisfactoriamente. Se ha iniciado un nuevo circuito de cobro el cual ha sido asignado a ${nextParticipant}.`;
};

exports.participantDidNotPaid = participantName => {
  return `El participante ${participantName} no pago su numero. Tuvo que pagar la Administradora o otros.`;
};

exports.shiftAsigned = participantName => {
  return `Se ha asignado un número vacante al participante ${participantName}.`;
};

exports.shiftRequestAcepted = (shiftNumber, payday) => {
  return `Su solicitud para tener el numero ${shiftNumber} ha sido aceptada por la administradora. Esto significa que Ud. cobrará la Ronda el dia ${payday}.`;
};

exports.roundCompleted = (roundName, endDate) => {
  return `Se ha completado la Ronda ${roundName} el día ${endDate}. Gracias por participar!`;
};

exports.garantorRequested = () => {
  return `El participante que Ud. promocionó no ha pagado su cuota este mes, necesitamos que gestione el cobro de esta cuota y abone al grupo el monto faltante.`;
};

exports.participantPayNumber = roundName => {
  return `Tu aporte a la ronda ${roundName} fue registrado con éxito!`;
};

exports.participantRequestPaymentMessage = (roundName, participantName) =>
  `El participante ${participantName} de la Ronda ${roundName} esta pidiendo cobrar su numero`;

exports.participantRequestAdminToAcceptPaymentMessage = (
  roundName,
  participantName
) =>
  `El participante ${participantName} de la Ronda ${roundName} esta pidiendo que se acepte su aporte`;

exports.participantRejected = (roundName, participantName) =>
  `El participante ${participantName} de la Ronda ${roundName} ha rechazado su invitacion para participar`;

exports.participantSwapped = (roundName, adminName) =>
  `El admin ${adminName} de la Ronda ${roundName} te ha reemplazado por otro participante en la misma`;

exports.roundNotStartedParticipantRejected = roundName =>
  `La Ronda ${roundName} no ha comenzado porque un participante rechazo su invitacion, debe reemplazarlo para poder empezar la Ronda`;

exports.roundConfirmationCompleted = roundName =>
  `La Ronda ${roundName} se ha procesado y ya puede entrar a la misma en la seccion "Por Iniciar"`;

exports.roundConfirmationFailed = roundName =>
  `La Ronda ${roundName} no se ha podido procesar, debera crearla denuevo`;

exports.roundInvitationCompleted = (roundName, accepted) =>
  `Tu pedido de ${
    accepted ? "aceptar" : "rechazar"
  } la invitacion a la Ronda ${roundName} fue completado con exito`;

exports.roundInvitationFailed = (roundName, accepted) =>
  `Tu pedido de ${
    accepted ? "aceptar" : "rechazar"
  } la invitacion a la Ronda ${roundName} tuvo un error, deberas intentarlo nuevamente`;

exports.participantPaymentConfirmed = roundName =>
  `Tu aporte para la Ronda ${roundName} fue procesado con exito!`;

exports.participantPaymentFailed = roundName =>
  `Tu aporte para la Ronda ${roundName} no se ha podido procesar, intentalo nuevamente`;

exports.adminSwappedConfirmed = (
  roundName,
  participantName,
  newParticipantName
) =>
  `El participante ${participantName} de la Ronda ${roundName} fue reemplazado por ${newParticipantName} con exito!`;

exports.adminSwappedFailed = (roundName, participantName, newParticipantName) =>
  `El participante ${participantName} de la Ronda ${roundName} no pudo ser reemplazado por ${newParticipantName}, intentalo denuevo mas tarde`;

exports.roundStartCompleted = roundName =>
  `La Ronda ${roundName} termino de procesar y ya comenzo`;

exports.roundStartFailed = roundName =>
  `La Ronda ${roundName} no se pudo procesar y no comenzo`;

exports.registerUserCompleted = email =>
  `Se completo el registro del usuario ${email} ya podes inciar sesion`;

exports.registerUserFailed = email =>
  `El registro del usuario ${email} fallo, tienes que intentarlo nuevamente`;

exports.numberPayedToUser = (admin, round, number) =>
  `El admin ${admin} de la Ronda ${round} ha confirmado tu cobro del número ${number}`;
