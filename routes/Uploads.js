const express = require("express");
const router = express.Router();
const { uploadExpense, uploadTSID, photoUpload } = require("../controllers/Uploads")

router.post('/expense', uploadExpense);
router.post('/tsid', uploadTSID);
router.post('/photoUpload', photoUpload);

module.exports = router;