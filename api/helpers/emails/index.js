const axios = require("axios");
const qs = require("querystring");

const { MAILGUN_ENCODED_AUTH, MAILGUN_DOMAIN } = process.env;
require("dotenv").config();

exports.sendMail = async (to, subject, text) => {
  const from = `No responder <no-responder@${MAILGUN_DOMAIN}>`;
  const body = {
    from,
    to,
    subject,
    text,
  };
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${MAILGUN_ENCODED_AUTH}`,
    },
  };
  const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
  try {
    const result = await axios.post(url, qs.stringify(body), config);
    console.log("Email send success: ", result);
  } catch (error) {
    console.error("Error sending email: ", error);
  }


};

