
const { accessKey, refreshKey } = require("../secret");


const setAccessToken=async(res,accessToken)=>{
    try {
         //token and cookies
         res.cookie('accessToken', accessToken,{
            maxAge : 5 * 60 * 1000,
            httpOnly : true,
            // secure : true,
            sameSite : 'none',
         })
    } catch (error) {
        throw error;
    }
}

const setRefreshToken=async(res,refreshToken)=>{
    try {
   //refresh token and cookies
   res.cookie('refreshToken', refreshToken,{
       maxAge : 7 * 24 * 60 * 60 * 1000,
       httpOnly : true,
       // secure : true,
       sameSite : 'none',
   })
    } catch (error) {
        throw error;
    }
}

module.exports = {setAccessToken,setRefreshToken}