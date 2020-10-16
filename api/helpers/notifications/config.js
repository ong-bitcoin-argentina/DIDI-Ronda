const fbadmin = require("firebase-admin");

require("dotenv").config();

const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;

fbadmin.initializeApp({
  credential: fbadmin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS)
});

exports.INTENTS = {
  ROUND_START: "ROUND_START",
  REMEMBER_PAYMENT: "REMEMBER_PAYMENT"
};

const sendNotification = message => {
  // Array of tokens
  if (message.tokens && message.tokens.length > 0) {
    return fbadmin
      .messaging()
      .sendMulticast(message)
      .then(response => {
        if (response.failureCount > 0) {
          console.log(response.responses);
          console.log(`${response.failureCount} tokens caused failures`);
          return false;
        } else {
          console.log("Notifications sent without errors");
          return true;
        }
      });
  } else {
    return false;
  }
};

const createMessage = (tokens, title, body, data) => {
  // Remove nulls tokens
  const tokensFilter = tokens.filter(t => t);
  const message = {
    notification: {
      title,
      body
    },
    tokens: tokensFilter
  };

  if (data) message.data = data;

  return message;
};

exports.createNotification = (tokens, title, body, data = null) => {
  try {
    const tokensMap = {};
    tokens.forEach(t => {
      tokensMap[t] = t;
    });
    const message = createMessage(Object.keys(tokensMap), title, body, data);
    return sendNotification(message);
  } catch (error) {
    console.log("=====================");
    console.log("createNotification ERROR:", error.message);
    console.log("=====================");
    return false;
  }
};

exports.createMessage = createMessage;
