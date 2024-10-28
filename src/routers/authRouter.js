const express = require('express');
const authController = require('../controllers/authController');
const checkAuth = require('../middlewares/checkAuth');
const router = express.Router();

// Public routes
router.route('/signup').post(async (req, res, next) => {
    try {
        await authController.userSignup(req, res);
    } catch (error) {
        next(error);
    }
});

router.route('/signin').post(async (req, res, next) => {
    try {
        await authController.userSignin(req, res);
    } catch (error) {
        next(error);
    }
});

// Protected route
router.route('/userData').get(checkAuth, async (req, res, next) => {
    try {
        await authController.userData(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
