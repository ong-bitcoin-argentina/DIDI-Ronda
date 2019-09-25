const express = require('express');
const router = express.Router();

// CONTROLLERS
const round_controller = require('../controllers/round');


// CREATE ROUTES ON ROUTER

// Request round information
router.get('/round/:id',                    round_controller.test);

// Request free number
router.post('/round/:id/requestNumber',     round_controller.test);


module.exports = router;