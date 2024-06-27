const User = require("../model/user.model");
const createError = require("http-errors");
const { responseUser } = require("./user.responseController");
const { default: mongoose } = require("mongoose");
const { findItems } = require("../services/findItem");
const deleteImg = require("../helper/deleteImage");
const { jwtWebTokenGenarator } = require("../helper/jwtTokenGenarate");
const { secretKey, clientURL, forgetPasswordKey } = require("../secret");
const smtpMailerSend = require("../helper/smtpMailer");
const jwt = require("jsonwebtoken");
const { Context } = require("express-validator/src/context");
const path = require("path");
const bcrypt = require("bcryptjs");
const { handleBanUnbanUser, findAllUser, findByUserId, deleteByUserId, updateByUserId, updateUserPasswordById, forgetPasswordByEmail, resetPassword } = require("../services/userService");
const cloudinary = require('../config/cloudinary');


//register user with jwt 
const processRegister=async(req,res,next)=>{
    try {
       const {name,email,password,phone,address} = req.body;
      
       const image = req.file?.path;
      
       if(!image){
        throw createError(404,'file is not required');  
    }
    if(image.size > 1024*1024 *2){
        throw createError(404,'image file size is too large');
    }
       const exitsEmail = await User.exists({email : email});
       if(exitsEmail){
        throw createError(409, 'User with this email already exits.please sign in new email');
       }
       //create web token
       const token = jwtWebTokenGenarator({name,email,password,phone,address,image},secretKey, '10h');

       //prepare email ]
       const emailDate = {
            email,
            subject : 'Account Activation Email',
            html : `
                <h2>Hellow ${name}</h2>
                    <p>Please click here <a href="${clientURL}/api/user/activate/${token}">to activate your accout</a></p>
            `
       }

       //send mail options
       try {
        //   await smtpMailerSend(emailDate);
       } catch (error) {
            next(createError(500, `failed varification ${error}`));
            return;
       }
        
       return responseUser(res,{
            statusCode : 202,
            message : `please go to your email for complite register process ${email}`,
            payload :{
                token,
            },
        })
    } catch (error) {
        if(error instanceof mongoose.Error){
            next(createError(404,'invalid user id'))
            return;
        }
        next(error);
    }
}

//varify register with nodemailer
const activateVarified=async(req,res,next)=>{
    try {
       
        const token = req.body.token;
        if(!token) throw createError(404,"token is not correct");

        try {
            //varified with jwt
            const decode = jwt.verify(token,secretKey);
            //if not found or varified decode
            if(!decode) throw createError(404,"jwt not varified");
            //if email exits
            const exitsEmail = await User.exists({email : decode.email});
            if(exitsEmail){
             throw createError(409, 'User with this email already exits.please sign in new email');
            }
            //cloudinary upload images methods
            const image = decode.image;
            console.log(image)
            
            if(image){
                const responseimage = await cloudinary.uploader
                       .upload(image,{folder:'User/user'});
                    
                    console.log(responseimage);
                decode.image = responseimage.secure_url;
            }
            
            console.log(decode.image);

            //create user with models
             await User.create(decode);
            return responseUser(res,{
                 statusCode : 202,
                 message : `user is successfully register`,
             })
        } catch (error) {
            if(error.name === 'TokenExpiredError'){
                throw createError(404,"token has been expire");
            }
            if(error.name === 'JsonWebTokenError'){
                throw createError(404,"invalid token");
            }
            throw error;
        }
    } catch (error) {
        if(error instanceof mongoose.Error){
            next(createError(404,'invalid user id'))
            return;
        }
        next(error);
    }
}

//delete users
const deleteUser=async(req,res,next)=>{
    try {
       
        const id = req.params.id;
            //display remove password
        const options = {password : 0};

         await deleteByUserId(id,options);
       return responseUser(res,{
            statusCode : 202,
            message : 'user delete successfully',
        })
    } catch (error) {
        if(error instanceof mongoose.Error){
            next(createError(404,'invalid user id'))
            return;
        }
        next(error);
    }
}

//get items
const getUser=async(req,res,next)=>{
    try {
        const id = req.params.id;
        //display remove password
        const options = {password : 0};
        const user = await findByUserId(id,options);

       return responseUser(res,{
            statusCode : 202,
            message : 'user return successfully',
            payload : {
                user,
            }
        })
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400,'invalid user id');
        }
        throw error;
    }
}

//user find by id 
const getAllUser=async(req,res,next)=>{
    try {
       //search values 
       const search = req.query.search || '' ;
       const page = Number(req.query.page) || 1 ;
       const limit = Number(req.query.page) || 1 ;
    
       const {user,paginations} = await findAllUser(search,page,limit);

       return responseUser(res,{
            statusCode : 202,
            message : 'user return successfully',
            payload : {
                user,
                paginations,
            }
        });
    } catch (error) {
        next(error);
    }
}


//update users
const updateUser=async(req,res,next)=>{
    try {
       
        const UpdateId = req.params.id;
        const options = {password : 0};
         const updateUser = await updateByUserId(req,UpdateId);
       return responseUser(res,{
            statusCode : 202,
            message : 'user update successfully',
            payload : {
                updateUser
            }
        })
    } catch (error) {
        return next(error);
    }
}

//manage ban unban
const handleBanUnban =async(req,res,next)=>{
    try {
       
        const UpdateId = req.params.id;
        await findItems(User,UpdateId);
        const action = req.body.action;
      
        await handleBanUnbanUser(UpdateId,action); 

       return responseUser(res,{
            statusCode : 202,
            message : `user was ${action} successfully`,
        })
    } catch (error) {
        return next(error);
    }
}

//update password
const updatePasswordById =async(req,res,next)=>{
    try {
       
        const {email,oldPassword,newPassword,confirmedPassword}  = req.body;
        const userId = req.params.id;
       
       const updatePassword = await updateUserPasswordById(userId,email,oldPassword,newPassword,confirmedPassword);
     

       return responseUser(res,{
            statusCode : 202,
            message : `user was updated password successfully`,
            payload :{
                updatePassword,
            }
        })
    } catch (error) {
        return next(error);
    }
}

//forget password 
const forgetPasswordById=async(req,res,next)=>{
    try {
        const {email} = req.body; 
        
        const token = await forgetPasswordByEmail(email);
        if(!token){
            throw createError(404,'did not get token')
        }
       return responseUser(res,{
            statusCode : 202,
            message : `please go to your email for complite reset password process ${email}`,
            payload :{
                token,
            },
        })
    } catch (error) {
        next(error);
    }
}

//reset password
const resetPasswordByToken=async(req,res,next)=>{
    try {
        const {token,password} = req.body;
        const updatePassword = await resetPassword(token,password);
       
       return responseUser(res,{
        statusCode : 202,
        message : `user reset password successfully`,
        payload :{
            updatePassword,
        }
    })
    } catch (error) {
        next(error);
    }
}
module.exports = {
    getUser,
    getAllUser,
    deleteUser,
    processRegister,
    activateVarified,
    updateUser,
    handleBanUnban,
    updatePasswordById,
    forgetPasswordById,
    resetPasswordByToken,
};


//  //search values
//  const search = req.query.search || "" ;
//  const page = Number(req.query.page) || 1 ;
//  const limit = Number(req.query.limit) || 1;

//  //serch regExpression logic
//  const regExSerch = new RegExp('.*' + search + '.*', 'i');

//  //which values through serch
//  const filters = {
//       isAdmin : {$ne : true},
//       $or : [
//          {name : {$regex : regExSerch}},
//          {email : {$regex : regExSerch}},
//          {phone : {$regex : regExSerch}},

//       ],
//  }
//  //not displayed password
//  const options = {password : 0}

//  //all user find through search values
//  const user = await User.find(filters,options).limit(limit).skip((page - 1) * limit);

//  //total page count 
//  const count = await User.find(filters).countDocuments();

//  //if user not found 
//  if(!user) throw createError(404, "user not found from database");

// pagination : {
//     totalPages : Math.ceil(count / limit),
//     currentPage : page,
//     previousPage : page-1 > 0 ? page - 1 :null,
//     nextPage : page + 1 <= Math.ceil(count / limit) ? page + 1 : null 
// }