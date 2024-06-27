const express = require('express');
const { getAllUser, getUser, deleteUser, processRegister, activateVarified, updateUser, handleBanUnban, updatePasswordById, forgetPasswordById, resetPasswordByToken} = require('../controller/user.controller');
const {upload} = require('../middleware/uploadFileImage');
const {runValidation} = require('../validators');
const { validationRegister, validateUserUpdatePassword, validatorsForgetPassword, validatorsResetPassword } = require('../validators/auth');
const {isLoggedIn, isAdmin} = require('../middleware/auth');

const router = express.Router();

router.get("/",getAllUser);
router.post("/process-register",
    upload.single("image"),
    validationRegister,
    runValidation,
    processRegister
);
router.post("/activate",activateVarified);
router.get("/:id",isLoggedIn,isAdmin,getUser);
router.delete("/:id",deleteUser);
router.put("/reset-password",validatorsResetPassword,runValidation,resetPasswordByToken);

router.put("/:id",upload.single("image"),updateUser);
router.put("/update-password/:id",isLoggedIn,validateUserUpdatePassword,runValidation,updatePasswordById);
//user make ban and unban
router.put("/manage-user/:id",isLoggedIn,isAdmin,handleBanUnban);
router.post("/forget-password",validatorsForgetPassword,runValidation,forgetPasswordById);




module.exports = router;