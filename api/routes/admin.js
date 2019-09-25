const express = require('express');
const router = express.Router();

// CONTROLLER
const user_controller = require('../controllers/user');
const round_controller = require('../controllers/round');

// CREATE ROUTES ON ROUTER

// Participant pay confirm
router.post('/round/:id/:user/payConfirm',          round_controller.test);

// Round pay confirm
router.post('/round/:id/payConfirm',                round_controller.test);

// Round manual start
router.post('/round/:id/start',                     round_controller.test);

// Assign number to participant
router.post('/round/:id/numberAssign',              round_controller.test);

// Show pending number requests
router.get('/round/:id/numberRequests',             round_controller.test);

// Number draw between participants
router.post('/round/:id/numberDraw',                round_controller.test);

// Invite participant to round
router.post('/round/:id/invite',                    round_controller.test);

// Send notification to guarantor 
router.post('/round/:id/guarantorNotification',     round_controller.test);

// Delete round
router.post('/round/:id/delete',                    round_controller.test);

module.exports = router;