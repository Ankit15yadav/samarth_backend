const express = require("express");
const router = express.Router();
const { GetApproval } = require("../controllers/Approval");

router.post('/GetApproval', GetApproval);

module.exports = router;