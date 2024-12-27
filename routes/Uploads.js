const express = require("express");
const router = express.Router();
const { uploadExpense, uploadTSID, photoUpload, uploadedImage } = require("../controllers/Uploads")

router.post('/expense', uploadExpense);
router.post('/tsid', uploadTSID);
router.post('/photoUpload', photoUpload);
router.post('/uploads', uploadedImage);

module.exports = router;