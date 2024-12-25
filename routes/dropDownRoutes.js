const express = require('express');
const router = express.Router();
const { Expense, Tsid, imageType } = require("../controllers/DropDown")


router.get('/expense', Expense);
router.post('/tsid', Tsid);
router.get('/getimage', imageType);

module.exports = router;