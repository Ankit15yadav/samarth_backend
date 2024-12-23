const express = require('express');
const router = express.Router();
const { Expense, Tsid } = require("../controllers/DropDown")


router.get('/expense', Expense);
router.post('/tsid', Tsid);

module.exports = router;