// ADMIN NOTIFICATIONS
exports.roundAboutToStart = (daysLeft, roundName) => {
  return `En ${daysLeft} días comenzará la Ronda ${roundName}. ¿Está todo listo? Recorda que podes modificar la fecha de inicio o si la quieres iniciar antes, puedes presionar el botón Iniciar.`;
};

exports.participantConfirmed = (participantName, requestedShift) => {
  return `Participante ${participantName} ha aceptado ser parte de La Ronda y desea obtener el número ${requestedShift}.`;
};

exports.shiftAboutToEnd = (daysLeft, shiftNumber, participantNmae) => {
  return `Atención: Quedan ${daysLeft} dias para pagar el número ${shiftNumber} al participante ${participantNmae}. El plazo de pago se vence el ${endDate}.`;
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

exports.roundStartedWithoutShift = roundName => {
  return `El administrador ha iniciado la nueva ronda y Ud. no tiene número asignado y será parte del sorteo. Si desea obtener un número en particular, ingrese a la aplicación, luego a La Ronda ${roundName} y solicite un número.`;
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
