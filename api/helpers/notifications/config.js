const fbadmin = require("firebase-admin");

require("dotenv").config();

const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;

fbadmin.initializeApp({
  credential: fbadmin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS)
});

const sendNotification = message => {

  // Array of tokens
  if (message.tokens && message.tokens.length > 0) {
    return fbadmin
      .messaging()
      .sendMulticast(message)
      .then(response => {
        if (response.failureCount > 0) {
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

exports.createNotification = (tokens, title, body, data) => {
  const message = {
    notification: {
        title: title,
        body: body,
    },
    data: data,
    tokens: tokens,
  };
  return sendNotification( message );
}