const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);
const allSettled = require("promise.allsettled");

const sendSMS = async (message, numbers) => {
  const results = await allSettled(
    numbers.map(num =>
      client.messages.create({
        body: message,
        from: twilioPhone,
        to: num
      })
    )
  );

  const errors = results
    .filter(p => p.status === "rejected")
    .map(p => p.reason);
  const fulfilledPromises = results.filter(p => p.status !== "rejected");
  console.log("Errors on SMS Send", errors.length ? errors: "No errors!");
  console.log("SMS Sent", fulfilledPromises);
};

exports.sendVerificationCode = (code, number) => {
  const message = `Tu código de verificación para La Ronda es ${code}`;
  return sendSMS(message, [number]);
};

exports.sendRoundInvitation = (numbers, roundName, adminName) => {
  const message = `Has sido invitado a la Ronda ${roundName} por ${adminName}`;
  return sendSMS(message, numbers);
};
