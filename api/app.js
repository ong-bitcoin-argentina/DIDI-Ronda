const express   = require('express'),
    app         = express(),
    http        = require('http'),
    server      = http.createServer(app),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser'),
    _           = require('lodash'),
    helmet      = require('helmet');


// CONFIGS
require('dotenv').config();


const { PORT, MONGO_SERVER, MONGO_DATABASE, ENVIROMENT } = process.env;

// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// SMALL SECURITY
app.use(helmet());


/*** MIDDLEWARES ****/
const appMiddleware       = require('./middleware/app');


// Log request on develop
ENVIROMENT === 'dev' && app.use('/',    appMiddleware.log)

// Basic auth to all api calls
app.use('/',              appMiddleware.auth);

// JWT

// User
app.use('/user',          appMiddleware.jwtCheck);

// Participant
app.use('/participant',   appMiddleware.jwtCheck);

// Admin
app.use('/admin',         appMiddleware.jwtCheck);


/*** ./MIDDLEWARES ****/


/*** ROUTES ****/
const guest         = require('./routes/guest'); // Imports routes for guest
const user          = require('./routes/user'); // Imports routes for user
const participant   = require('./routes/participant'); // Imports routes for participant
const admin         = require('./routes/admin'); // Imports routes for admin

app.use('/',              guest);
app.use('/user',          user);
app.use('/participant',   participant);
app.use('/admin',         admin);
/*** ./ROUTES ****/


/*** SERVER ****/
mongoose.set('useCreateIndex', true)
mongoose.connect(`${MONGO_SERVER}/${MONGO_DATABASE}`, { useNewUrlParser: true }, (err, res) => {
  if(err){
    console.log('ERROR: connecting to Database. ' + err);
  }

  app.listen(PORT, () => {
    console.log(`Node server running on http://localhost:${PORT}`);
  });
});
/*** ./SERVER ****/


/*** EXPORT FOR TESTING PURPOSE ****/
module.exports = app;
/*** ./EXPORT FOR TESTING PURPOSE ****/