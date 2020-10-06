const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);
const allSettled = require('promise.allsettled');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const {customError} = require('../errorHandler');

const sendSMS = async (message, numbers) => {
  const results = await allSettled(
    numbers.map(num =>
      client.messages.create({
        body: message,
        from: twilioPhone,
        to: num,
      }),
    ),
  );

  const errors = results
    .filter(p => p.status === 'rejected')
    .map(p => p.reason);
  const fulfilledPromises = results.filter(p => p.status !== 'rejected');
  console.log('Errors on SMS Send', errors.length ? errors : 'No errors!');
  console.log('SMS Sent', fulfilledPromises);
};

exports.sendVerificationCode = (code, number) => {
  const message = `Tu código de verificación para La Ronda es ${code}`;
  return sendSMS(message, [number]);
};

exports.sendRoundInvitation = (numbers, roundName, adminName) => {
  const message = `${adminName} te invitó a la Ronda ${roundName}`;
  return sendSMS(message, numbers);
};

exports.normalizePhone = (phone, country = 'AR') => {
  let number;
  let finalCountry = country;

  try {
    //If the phone number is already formated with a country code it wont throw any error
    number = phoneUtil.parseAndKeepRawInput(phone, country);

    // We remove in Argentina numbers the leading 9 before the area code
    // We normalize this so we don't have issues with 9 numbers
    // The 9 is NOT required to send SMS
    if (number.getNationalNumber().toString()[0] === '9') {
      const properNumber = number
        .getNationalNumber()
        .toString()
        .substring(1);
      number = phoneUtil.parseAndKeepRawInput(properNumber, country);
    }
  } catch (error) {
    // If the number above threw error we asume that it's from Argentina ( in the future we should get it from the admin number )
    console.log('===== ERROR on parsing normalidez phone =====');
    if (error.message === 'Invalid country calling code') {
      // Get first number from the phone
      const {0: firstNumber} = phone;

      if (firstNumber !== '9') {
        phone = `9 ${phone}`;
      }

      number = phoneUtil.parseAndKeepRawInput(phone, finalCountry);
    } else {
      throw new customError(error.message);
    }
  }

  // Format the phone number to international format
  return phoneUtil.format(number, PNF.E164);
};
