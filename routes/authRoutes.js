const express = require('express');
const { signIn, getUsers, updateLocation, signUp } = require('../controllers/auth');
const { authentication } = require("../middleware/authentication")
const router = express.Router();

router.post('/login', signIn);
router.get('/getuser', getUsers);
router.post('/updateLocation', updateLocation);
router.post('/signup', signUp);

module.exports = router;