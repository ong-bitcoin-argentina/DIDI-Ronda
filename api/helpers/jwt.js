const jsonwebtoken = require("jsonwebtoken");
const errorHandler = require("../helpers/errorHandler");
require("dotenv").config();

const sign = payload => {
  return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

/**
 * This method is a middleware to check the token existence!
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const check = (req, res, next) => {
  let token = req.headers["authorization"];

  if (token && token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);

    jsonwebtoken.verify(token, process.env.JWT_SECRET, (error, decode) => {
      if (error) {
        req.jwt = null;
        return errorHandler.unauthorized(res, "Token is not valid");
      } else {
        req.body.username = decode.username;
        next();
      }
    });
  } else {
    return errorHandler.unauthorized(res, "Auth token is not supplied");
  }
};

const getUsernameFromToken = req => {
  let token = req.headers["authorization"];
  let username = "";
  if (token && token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);

    jsonwebtoken.verify(token, process.env.JWT_SECRET, (error, decode) => {
      if (error) {
        req.jwt = null;
        return false;
      }
     return username = decode.username;
    });
  }
  return username;
};

module.exports = { sign, check, getUsernameFromToken };
