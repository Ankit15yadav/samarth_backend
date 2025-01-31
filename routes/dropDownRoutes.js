const express = require('express');
const router = express.Router();
const { Expense, Tsid, imageType, getOneExpense, upDateExpense } = require("../controllers/DropDown")


router.get('/expense', Expense);
router.post('/tsid', Tsid);
router.get('/getimage', imageType);
router.post('/oneExpense', getOneExpense);
router.post('/update', upDateExpense);

module.exports = router;