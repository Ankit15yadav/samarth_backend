const express = require('express');
const { signIn, getUsers, updateLocation } = require('../controllers/auth')
const router = express.Router();

router.post('/login', signIn);
router.get('/getuser', getUsers);
router.post('/updateLocation', updateLocation);

module.exports = router;