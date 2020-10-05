const errorHandler = require("../helpers/errorHandler");
const jwt = require("../helpers/jwt");

const log = (req, res, next) => {
  console.log("====================================");
  console.log("TIME", new Date());
  console.log("NEW REQUEST");
  console.log("URL", req.url);
  console.log("HEADERS", req.headers);
  console.log("BODY", req.body);
  console.log("====================================");
  next();
};

const auth = (req, res, next) => {
  // CHECK API KEY
  if (process.env.API_KEY === req.headers.api_key) {
    next();
  } else {
    return errorHandler.unauthorized(res, "Invalid API KEY");
  }
};

const insecure = (req, res, next) => {
  const { ENVIROMENT } = process.env;
  if (!ENVIROMENT || ENVIROMENT.toLowerCase().includes("prod")) {
    return errorHandler.unauthorized(res, "Endpoint not available");
  } else {
    next();
  }
};

const jwtCheck = (req, res, next) => jwt.check(req, res, next);

module.exports = { log, auth, jwtCheck, insecure };
