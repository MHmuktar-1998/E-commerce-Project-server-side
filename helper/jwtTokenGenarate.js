const jwt = require("jsonwebtoken");
const { secretKey } = require("../secret");

const jwtWebTokenGenarator =(payload,secretKey,expiresIn)=>{
    if(typeof payload !== 'object' || payload === '') {
        throw new Error('payload must be object and none empty string');
    }
    if(typeof secretKey !== 'string' || secretKey === ''){
        throw new Error ('secret key must be string and none string');
    }
   try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
}catch (error) {
    console.error('Failed to sign in JWT :', error);
    throw error;
   }
}
module.exports = {jwtWebTokenGenarator}