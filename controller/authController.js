const createError = require("http-errors");
const User = require("../model/user.model");
const { responseUser } = require("./user.responseController");
const bcrypt = require("bcryptjs");
const { jwtWebTokenGenarator } = require("../helper/jwtTokenGenarate");
// const cookie = require("cookie-parser");
const { accessKey, refreshKey } = require("../secret");
const jwt = require("jsonwebtoken");
const { setAccessToken, setRefreshToken } = require("../services/tokenGenarate");




const authLoggedInHandler = async(req,res,next)=>{
    try {
        //email and password => req.body
        const {email,password} = req.body;
        //isExitst email
        const user =  await User.findOne({email});
        if(!user){
            throw createError(403,'email is doesnot exists.please sing')
        }
        //compare password 
        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){
            throw createError(402,'password is not match.please give correct password');

        }
        //isBanned user
        if(user.isBanned){
            throw createError(401,'you are banned.please contract authorities');

        }
        //token and cookies
         const accessToken = jwtWebTokenGenarator({user},accessKey,'5m');
        await setAccessToken(res,accessToken);
        //refresh token and cookies
        const refreshToken = jwtWebTokenGenarator({user},refreshKey,'7d');
        await setRefreshToken(res,refreshToken);

         const userWithoutPassword = await User.findOne({email}).select('-password');
        //success response 
        return responseUser(res,{
            statusCode : 202,
            message : 'user return successfully',
            payload : {
                userWithoutPassword,
            }
        })
    } catch (error) {
        next(error);
    }
}

const authLoggedOutHandler = async(req,res,next)=>{
    try {
        
        res.clearCookie('access_token');
        //success response 
        return responseUser(res,{
            statusCode : 202,
            message : 'user return successfully',
            payload : {
            }
        })
    } catch (error) {
        next(error);
    }
}

const handleRefreshToken=async(req,res,next)=>{
    try {
        const oldCookies = req.cookies.refreshToken;

        const decode = jwt.verify(oldCookies,refreshKey);
        if(!decode) throw createError(404,"cookies not varified");

         //accessToken and cookies
         const accessToken = jwtWebTokenGenarator(decode.user,accessKey,'5m');
         await setAccessToken(res,accessToken);

         return responseUser(res,{
            statusCode : 202,
            message : 'refresh token genarate successfully',
            payload : {
            }
        })
    } catch (error) {
        throw error;
    }
}

const handleProtected=async(req,res,next)=>{
    try {
        const accessToken = req.cookies.accessToken;
            
        const decodeToken = jwt.verify(accessToken,accessKey);
        if(!decodeToken){
            throw createError(404,'access protected')
        }

         return responseUser(res,{
            statusCode : 202,
            message : 'protected ressorce access successfully',
            payload : {
            }
        })
    } catch (error) {
        throw error;
    }
}


module.exports = { authLoggedInHandler,authLoggedOutHandler,handleRefreshToken,handleProtected,};