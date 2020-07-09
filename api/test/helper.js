const jsonwebtoken = require("jsonwebtoken");
const JWT = require("../helpers/jwt");

exports.decodeJWT = token => {
  return jsonwebtoken.verify(token, process.env.JWT_SECRET, (error, decode) => {
    if (error) {
      return null;
    } else {
      return decode.username;
    }
  });
};

exports.createToken = username => {
  return JWT.sign({ username: username });
};
