const express = require("express");
// Array flat polyfill for Node 10
require("array-flat-polyfill");
const app = express();
const http = require("http");
http.createServer(app);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const blacklistedPasswordsJSON = require("./utils/blacklistedPasswords.json");
const blacklistedPasswordManager = require("./managers/blacklisted_password");
const { version } = require("./package.json");
const helmet = require("helmet");

// CONFIGS
require("dotenv").config();

// Agenda
const { agendaStart, walletRefillJob } = require("./jobs/jobs");

const { PORT, IP_ADDRESS, MONGO_SERVER, MONGO_DATABASE, ENVIROMENT } = process.env;

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// SMALL SECURITY
app.use(helmet());

/*** MIDDLEWARES ****/
const appMiddleware = require("./middleware/app");

// Log request on develop
ENVIROMENT === "dev" && app.use("/", appMiddleware.log);

// Basic auth to all api calls
app.use("/", appMiddleware.auth);

// JWT

// User
app.use("/user", appMiddleware.jwtCheck);

// Participant
app.use("/participant", appMiddleware.jwtCheck);

// Admin
app.use("/admin", appMiddleware.jwtCheck);

/*** ./MIDDLEWARES ****/

/*** ROUTES ****/
const guest = require("./routes/guest"); // Imports routes for guest
const user = require("./routes/user"); // Imports routes for user
const participant = require("./routes/participant"); // Imports routes for participant
const admin = require("./routes/admin"); // Imports routes for admin

app.use("/", guest);
app.use("/user", user);
app.use("/participant", participant);
app.use("/admin", admin);
/*** ./ROUTES ****/

/*** SERVER ****/
mongoose.set("useCreateIndex", true);
mongoose.connect(
  `${MONGO_SERVER}/${MONGO_DATABASE}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log("ERROR: connecting to Database. " + err);
    }
    app.listen(PORT, IP_ADDRESS, () => {
      console.log(`------ LA RONDA API ------`);
      console.log(`-   version ${version}   -`);
      console.log(`-   ENV: ${ENVIROMENT}   - `);
      console.log(`-------------------------- `);
      console.log(`Node server running on http://${IP_ADDRESS}:${PORT}`);
      
      agendaStart();
      walletRefillJob();
    });
  }
);
/*** ./SERVER ****/

/*** EXPORT FOR TESTING PURPOSE ****/
module.exports = app;
/*** EXPORT FOR TESTING PURPOSE ****/
