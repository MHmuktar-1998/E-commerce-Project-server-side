const  {validationResult} = require('express-validator');
const { errorResponseRoute } = require('../controller/user.responseController');


const runValidation =(req,res,next)=>{
   try {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return errorResponseRoute(res,{
            statusCode:422,
            message:error.array()[0].msg
        });     
    }
    return next();
   } catch (error) {
        return next(error);
   }

}


module.exports = {runValidation};
