const express = require('express');
const {runValidation} = require('../validators');
const { authLoggedInHandler, authLoggedOutHandler, handleProtected, handleRefreshToken } = require('../controller/authController');
const { isLoggedOut, isLoggedIn } = require('../middleware/auth');
const { validationLoggedIn } = require('../validators/auth');


const authLogged = express.Router();
authLogged.post("/login",validationLoggedIn,runValidation,isLoggedOut,authLoggedInHandler);
authLogged.post("/logout",isLoggedIn,authLoggedOutHandler);

authLogged.get("/protected-router",handleProtected);
authLogged.get("/refresh-token",handleRefreshToken);



module.exports = authLogged;