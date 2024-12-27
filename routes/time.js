const express = require('express');
const router = express.Router();
const { logoutTime } = require("../controllers/logoutTime")

router.post('/logoutTime', logoutTime);

module.exports = router;