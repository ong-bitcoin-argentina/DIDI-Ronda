const express = require('express');
const router = express.Router();

// CONTROLLER
const user_controller = require('../controllers/user');

// CREATE ROUTES ON ROUTER

// App login
router.post('/login',       user_controller.test);

// App register
router.post('/register',    user_controller.test);

// App forgot password
router.post('/forgot',      user_controller.test);

module.exports = router;