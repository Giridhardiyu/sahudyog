const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.route('/signup').post(authController.userSignup);
router.route('/signin').post(authController.userSignin);

module.exports = router;
