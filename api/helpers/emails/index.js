var nodemailer = require("nodemailer");

require("dotenv").config();

//Gmail credentials need to be stored as env variables, just security requirements :)
const { GMAIL_USER, GMAIL_PASSWORD } = process.env;

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASSWORD,
  },
});

exports.sendMail = (to, subject, text) => {
  var mailOptions = {
    from: "larondainfuy@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

//Email sending example
// mailing.sendMail("email@domain.com", 'La Ronda', 'Un saludo a nuestro usuario!')
