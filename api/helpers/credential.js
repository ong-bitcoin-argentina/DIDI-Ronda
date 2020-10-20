const moment = require("moment");

const fields = {
  id: "Código de Ronda",
  roundName: "Nombre de Ronda",
  myNumber: length => (length > 1 ? `Mis números` : `Mi número`),
  amount: "Monto de la Ronda [$]",
  individualAmount: "Monto individual [$]",
  state: "Estado de la Ronda",
  startDate: "Fecha de Inicio",
  endDate: "Fecha de Fin",
  rol: "Rol",
  did: "DID",
  recurrence: "Periodicidad de Ronda",
  shifts: "Cantidad de Números",
  defaulted: "# Fuera de término",
  noPayed: "# Impagas",
  name: "NOMBRE",
  lastname: "APELLIDO"
};

const getRol = (participant, round) => {
  return participant.user.id === round.admin.id
    ? "Administrador"
    : "Participante";
};

const getPaymentInfo = (participantId, shifts) => {
  let defaulted = 0;
  let noPayed = 0;
  shifts.forEach(({ pays, limitDate }) => {
    const participantPayment = pays.find(
      ({ participant }) => participant.toString() === participantId
    );
    if (!participantPayment) {
      noPayed++;
      return;
    }
    if (participantPayment.date > limitDate) defaulted++;
  });
  return {
    defaulted,
    noPayed
  };
};

const getCredential = (participant, round) => {
  const { defaulted, noPayed } = getPaymentInfo(
    participant._id.toString(),
    round.shifts
  );

  const credential = {
    [fields.id]: round._id,
    [fields.roundName]: round.name,
    [fields.amount]: round.totalAmount,
    [fields.startDate]: moment(round.startDate).format("YYYY-MM-DD"),
    [fields.endDate]: moment(round.endDate).format("YYYY-MM-DD"),
    [fields.recurrence]: round.normalizedRecurrence,
    [fields.shifts]: round.shifts.length,
    [fields.rol]: getRol(participant, round),
    [fields.name]: participant.user.name,
    [fields.lastname]: participant.user.lastname,
    [fields.defaulted]: defaulted,
    [fields.noPayed]: noPayed
  };
  return { credential, participant };
};

module.exports = {
  fields,
  getCredential
};
