const express = require("express");
const router = express.Router();
const { authentication } = require("../middleware/authentication")
const { uploadExpense, uploadTSID, photoUpload, deleteImage, uploadedImage } = require("../controllers/Uploads")

router.post('/expense', uploadExpense);
router.post('/tsid', uploadTSID);
router.post('/photoUpload', photoUpload);
router.post('/uploads', uploadedImage);
router.delete('/delete', deleteImage);

module.exports = router;