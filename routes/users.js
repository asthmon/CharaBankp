const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/asyncErrorhandler');
const passport = require('passport');
const { storeReturnTo } = require('../middleware')
const users = require('../controllers/users')


//Register
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

//Log In
router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local',
        { failureFlash: true, failureRedirect: '/login' }),
        users.login)

//Log Out
router.get('/logout', users.logout);




module.exports = router;
