const express = require('express');
const {runValidation} = require('../validators');
const { validationCategory } = require('../validators/categoryValidation');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const { createCategory, getAllCategories, getCategory, updateCategory, deleteCategory } = require('../controller/categorisController');


const categoris = express.Router();

categoris.post("/create-categories",validationCategory,runValidation,isLoggedIn,isAdmin,createCategory);
categoris.get("/",getAllCategories);
categoris.get("/:slug",getCategory);
categoris.put("/:slug",validationCategory,runValidation,isLoggedIn,isAdmin,updateCategory);
categoris.delete("/:slug",validationCategory,runValidation,isLoggedIn,isAdmin,deleteCategory);




module.exports = categoris;