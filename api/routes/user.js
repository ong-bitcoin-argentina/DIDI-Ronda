const express = require('express');
const router = express.Router();

// CONTROLLERS
const user_controller = require('../controllers/user');
const round_controller = require('../controllers/round');


// CREATE ROUTES ON ROUTER

// User information
router.get('/:id',              user_controller.test)

// Update user information
router.put('/:id',              user_controller.test)

// List of rounds for user
router.get('/:id/rounds',        round_controller.test);

// Create new round and become admin
router.post('/:id/round',       round_controller.test);

// Accept round invitation
router.post('/round/:id/accept',    round_controller.test);


module.exports = router;