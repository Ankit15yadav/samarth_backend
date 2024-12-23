const express = require("express");
const router = express.Router();
const { uploadExpense, uploadTSID } = require("../controllers/Uploads")

router.post('/expense', uploadExpense);
router.post('/tsid', uploadTSID);

module.exports = router;