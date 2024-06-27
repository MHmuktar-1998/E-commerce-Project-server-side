const createError = require('http-errors');
const User = require('../model/user.model');
const deleteImg = require('../helper/deleteImage');
const { default: mongoose } = require('mongoose');
const bcrypt = require("bcryptjs");
const { forgetPasswordKey, clientURL } = require('../secret');
const smtpMailerSend = require('../helper/smtpMailer');
const { jwtWebTokenGenarator } = require('../helper/jwtTokenGenarate');
const jwt = require("jsonwebtoken");
const { publicIdWithoutExtentionFromUrl, deletePublicId } = require('../helper/cloudinaryHelper');
const cloudinary = require('../config/cloudinary');

const handleBanUnbanUser =async(UpdateId,action)=>{
    try {
          
        let updates ={};
        if(action == 'ban'){
           updates = {isBanned : true}
        }else if(action == 'unban'){
            updates = {isBanned : false}
        }else{
            throw createError(404,'action is not found')
        }
        const updateOptions = {new : true,runValidators : true, context : 'query'};
    
       const updateUser = await User.findByIdAndUpdate(
        UpdateId,
        updates,
        updateOptions,
    ).select('-password');

       if(!updateUser){
        throw createError(404,'User with this id does not exits');
       }

    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400,'invalid user id');
        }
        throw (error);
    }
}

const findAllUser =async(search,page,limit)=>{
    try {
        //regular express search values logic 
        const regExSearch = new RegExp('.*' + search + '.*' , 'i');
        const filters = {
            isAdmin : {$ne : true},
            $or : [
                {name : {$regex : regExSearch }},
                {email : {$regex : regExSearch }},
                {phone : {$regex : regExSearch }},
            ]
        }
        //display remove password
        const options = {password : 0};

       //find all data from databse through serch values
       const user = await User.find(filters,options).limit(limit).skip((page - 1) * limit);

       //total page count in database through filters values 
       const count = await User.find(filters).countDocuments();

       //if user not found 
       if(!user) throw createError(404, 'user not found');

       return {
                user,
                paginations : {
                      totalPage : Math.ceil(count / limit),
                      currentPage : page,
                      previousPage : page-1 > 0 ? page - 1 : null,
                      nextPatge : page + 1 <= Math.ceil(count/limit) ? page + 1 : null
                }
        };
    } catch (error) {
        throw error;
    }
}

const findByUserId=async(id,options={})=>{
    try {
        const user = await User.findById(id,options);
        if(!user){
            throw createError(404,'user is not found');
        }
        return user;
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400,'invalid user id');
        }
        throw error;
    }
}

const deleteByUserId=async(id,options)=>{
    try {
       
       const user = await User.findByIdAndDelete({_id : id ,isAdmin : false});

        // const imageDeletePath = user.image;
          
         
    
        if(user && user.image){
            // await deleteImg(user.image);
            const publicId = await publicIdWithoutExtentionFromUrl(user.image);
            await deletePublicId('User/user',publicId,'User');
        }

        //  //imageDeleteMethods
        //  deleteImg(imageDeletePath);
       
    } catch (error) {
        throw error;
    }
}

const updateByUserId=async(req,UpdateId)=>{
    try {
        const user = await User.findById(UpdateId);
        const updateOptions = {new : true,runValidators : true, context : 'query'};
        let updates = {};

        for (const key in req.body) {
            if (['name','password','phone','address'].includes(key)) {
                updates[key] = req.body[key];   
            }else if(['email'].includes(key)){
                throw new Error('email does not change or update')
            }
            
        }
       const image = req.file?.path;
       if(image){
            if(image.size > 1024 * 1024  * 2){
                throw new Error('file is too large')
            }
             const responseimage = await cloudinary.uploader
             .upload(image,{folder: 'User/user'});
             updates.image =  responseimage.secure_url;
            }
            
            // user.image !== 'default.png' && deleteImg(user.image);
       
       
       const updateUser = await User.findByIdAndUpdate(UpdateId,updates,updateOptions);

       if(!updateUser){
        throw createError(404,'User with this id does not exits');
       }
       if(user && user.image){
        const publicId = await publicIdWithoutExtentionFromUrl(user.image);
        console.log(publicId);
        await deletePublicId('User/user',publicId,'user');
    }
   
       return updateUser;

    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400,'invalid user id');
        }
        throw error;
    }
}

const updateUserPasswordById=async(userId,email,oldPassword,newPassword,confirmedPassword)=>{
    try {
        const user = await User.findOne({email: email});

        if(newPassword !== confirmedPassword){
            throw createError(402,'New Password and Confirmed Password did not match');
        }

        //compare password 
        const comparePassword = await bcrypt.compare(oldPassword, user.password);
        if(!comparePassword){
            throw createError(402,'password is not match.please give correct password');
        };

        // const filter = {userId};
         const updates = {$set:{password : newPassword}};
         const updateOptions= {new : true};
         
         const updatePassword = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions,
            // {password : newPassword},
            // {new : true},
        ).select('-password');

        if(!updatePassword){
            throw createError(404,'password doesnt update.something wrong in update logic');
        }

        return updatePassword;
    } catch (error) {
        throw error;
    }
}

const forgetPasswordByEmail=async(email)=>{
    try {
         //find email address 
         const userEmail = await User.findOne({email : email});
         if(!userEmail){
             throw createError(404,'did not matches in yor email address.please input correct email for reset password');
         }
 
          //create web token
        const token = jwtWebTokenGenarator({email},forgetPasswordKey, '10h');
 
        //prepare email ]
        const emailDate = {
             email,
             subject : 'Account Activation Email',
             html : `
                 <h2>Hellow ${userEmail.name}</h2>
                     <p>Please click here <a href="${clientURL}/api/user/forget-password/${token}">to activate your accout</a></p>
             `
        }
 
        //send mail options
        try {
           await smtpMailerSend(emailDate);
        } catch (error) {
             next(createError(500, `failed varification ${error}`));
             return;
        }
         return token;
    return token;
    } catch (error) {
        throw error;
    }
}

const resetPassword=async(token,password)=>{
    try {
        const decode = jwt.verify(token,forgetPasswordKey);
        //if not found or varified decode
        if(!decode) throw createError(404,"decode reset password not varified");
        
        const filter = {email : decode.email};
        const updates = {password : password};
        const updateOptions= {new : true};
        
        const updatePassword = await User.findOneAndUpdate(
            filter,
           updates,
           updateOptions,
           // {password : newPassword},
           // {new : true},
       ).select('-password');

       if(!updatePassword){
           throw createError(404,'reset password doesnt update.something wrong in update logic');
       }
       return updatePassword;
    } catch (error) { 
        throw error;
    }
}
module.exports = {handleBanUnbanUser,findAllUser,findByUserId,deleteByUserId,updateByUserId,updateUserPasswordById,forgetPasswordByEmail,resetPassword};