const jwt = require('jsonwebtoken');
const createError = require("http-errors");
const { accessKey } = require('../secret');

const isLoggedIn =async(req,res,next)=>{
    try {
        const token = req.cookies.accessToken;
        if(!token){
            throw createError(400, 'Token not found');
        }
       
        const decode = await jwt.verify(token,accessKey);
       
        if(!decode){
            throw createError(401, 'not varified');
        }
      req.user = decode.user;
        next();
    } catch (error) {
        return next(error);
    }
}

const isLoggedOut =async(req,res,next)=>{
    try {
        const token = req.cookies.accessToken;
        if(token){
          const decode = await jwt.verify(token,accessKey);
            if(decode){
                throw createError(401, 'User is already logged in');
            }
        }

        next();
    } catch (error) {
        return next(error);
    }
}


const isAdmin =async(req,res,next)=>{
    try {
        
       if(!req.user.isAdmin){
           throw createError(402, 'Forbiden please you are first admin');
       }
        next();
    } catch (error) {
        return next(error);
    }
}
module.exports = {isLoggedIn,isLoggedOut,isAdmin};