const  {body} = require('express-validator');
const createHttpError = require('http-errors');

const validationRegister = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage('Name is required.please Enter Youer Name')
    .isLength({min : 3,max : 30})
    .withMessage('Name should be at least 3-30 charecters'),

    body("email")
    .trim()
    .notEmpty()
    .withMessage('Email is required.please Enter Youer Email'),

    body("password")
    .trim()
    .notEmpty()
    .withMessage('password is required.please Enter Youer password')
    .isLength({min : 6})
    .withMessage('Password should be at least 6 chareacters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('please enter your at least uppercase and lowercase number and also special cherecters'),

    body("phone")
    .trim()
    .notEmpty()
    .withMessage('Phone is required.please Enter Youer phone number'),

    body("address")
    .trim()
    .notEmpty()
    .withMessage('address is required.please Enter Youer address')
    .isLength({min : 3})
    .withMessage('Addres should be at least 3 charecters'),

    body("image")
    .optional()
    .isString()
    // .custom((value,{req})=>{
    //     if(!req.file || !req.file.buffer){
    //         throw new Error('user image is requires')
    //     }
    //     return true;
    // })
    .withMessage('images must be string')
    
];


const validationLoggedIn = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage('Email is required.please Enter Youer Email'),

    body("password")
    .trim()
    .notEmpty()
    .withMessage('password is required.please Enter Youer password')
    .isLength({min : 6})
    .withMessage('Password should be at least 6 chareacters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('please enter your at least uppercase and lowercase number and also special cherecters'),
];

const validateUserUpdatePassword = [
    body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage('old password is required.please Enter Youer old password')
    .isLength({min : 6})
    .withMessage('old password should be at least 6 chareacters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('please enter your at least uppercase and lowercase number and also special cherecters'),

    body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('new password is required.please Enter Youer new password')
    .isLength({min : 6})
    .withMessage('Password should be at least 6 chareacters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('please enter your at least uppercase and lowercase number and also special cherecters'),

    body('confirmedPassword').custom((value,{req})=>{
        if(value !== req.body.newPassword){
            throw createHttpError(404,'New password and confirmed password doesnot matches ');
        }
        return true;
    })
];

const validatorsForgetPassword = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage('Email is required.please Enter Youer Email')
];

const validatorsResetPassword = [
    body('token')
    .trim()
    .notEmpty()
    .withMessage('token is required.plaese enter your token for varified'),

    body("password")
    .trim()
    .notEmpty()
    .withMessage('password is required.please Enter Youer password')
    .isLength({min : 6})
    .withMessage('Password should be at least 6 chareacters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('please enter your at least uppercase and lowercase number and also special cherecters')


];
module.exports  = {validationRegister,validationLoggedIn,validateUserUpdatePassword,validatorsForgetPassword,validatorsResetPassword}


