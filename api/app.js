require("dotenv").config();
require('./services/logger');
const express = require("express");
// Array flat polyfill for Node 10
require("array-flat-polyfill");
const app = express();
const http = require("http");
http.createServer(app);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");

// Agenda
const { agendaStart, permanentJob } = require("./jobs");

const { PORT, MONGO_URI, ENVIRONMENT, VERSION } = process.env;
console.log(`MONGO_URI: ${MONGO_URI}`);

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// SMALL SECURITY
app.use(helmet());

/*** MIDDLEWARES ****/
const appMiddleware = require("./middleware/app");

// Log request on develop
const isDevEnvironment = ENVIRONMENT === "qa" || ENVIRONMENT === "next";
if (isDevEnvironment) app.use("/", appMiddleware.log);

// Basic auth to all api calls
app.use("/", appMiddleware.auth);

// JWT

// User
app.use("/user", appMiddleware.jwtCheck);

// Participant
app.use("/participant", appMiddleware.jwtCheck);

// Admin
app.use("/admin", appMiddleware.jwtCheck);

// Credentials
app.use("/credentials", appMiddleware.auth);

// Insecure endpoints (for QA testing)
app.use("/insecure", appMiddleware.insecure);

/*** ./MIDDLEWARES ****/

/*** ROUTES ****/
const guest = require("./routes/guest"); // Imports routes for guest
const user = require("./routes/user"); // Imports routes for user
const participant = require("./routes/participant"); // Imports routes for participant
const admin = require("./routes/admin"); // Imports routes for admin
const credentials = require("./routes/credentials");
const insecure = require("./routes/insecure");

app.use("/", guest);
app.use("/user", user);
app.use("/participant", participant);
app.use("/admin", admin);
app.use("/credentials", credentials);
app.use("/insecure", insecure);
app.use("*", function notFoundRoute(req, res) {
  res.status(404).json({ message: "route not found" });
});
/*** ./ROUTES ****/

/*** SERVER ****/
mongoose.connect(MONGO_URI,  { 
  useNewUrlParser: true,
  useFindAndModify: false, 
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(
    () => { 
      app.listen(PORT, () => {
        console.log(`------ LA RONDA API ------`);
        console.log(`-   version ${VERSION}   -`);
        console.log(`-   ENV: ${ENVIRONMENT}  -`);
        console.log(`--------------------------`);
        console.log(`Node server running on port ${PORT}`);
        agendaStart();
        permanentJob();
      });
     },
    (err) => {
      console.log("ERROR: connecting to Database.");
      console.log(err);
    },
  );

/*** ./SERVER ****/

/*** EXPORT FOR TESTING PURPOSE ****/
module.exports = app;
/*** EXPORT FOR TESTING PURPOSE ****/
