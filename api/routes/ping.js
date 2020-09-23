const express = require("express");
const router = express.Router();

// App ping
router.get("/ping", function ping(_, res) {
    res.send('pong');
});

module.exports = router;