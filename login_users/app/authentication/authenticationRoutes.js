'use strict'

const express = require('express');
const authenticationController = require('./authenticationController');
const md_auth = require('./../common/middlewares/authenticated')
const router = express.Router();


/**
 * APIs
 */
router.post("/user/authentication", authenticationController.userAuthController);
router.post("/user/logout", md_auth.authenticated, authenticationController.logOutController);


router.post("/user", md_auth.authenticated, authenticationController.createUserController);
router.put("/user/password", authenticationController.updatePasswordController);



module.exports = router;