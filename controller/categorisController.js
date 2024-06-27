const category = require("../model/categoryModel");
const { ceateCategorisService, getCategoris, getCategorys, categoryUpdate, categoryDelete } = require("../services/categories");
const { responseUser } = require("./user.responseController");
const slugify = require('slugify')

const createCategory=async(req,res,next)=>{
    try {
        const {name} = req.body;
        const categorisCreate = await ceateCategorisService(name);
        
       return responseUser(res,{
        statusCode : 202,
        message : `category was created successfully`,
        payload :{
            categorisCreate,
        }
    })
    } catch (error) {
        next(error);
    }
}

const getAllCategories=async(req,res,next)=>{
    try {
        const getAllCategory = await getCategoris();
       return responseUser(res,{
        statusCode : 202,
        message : `fatching all categoris successfully`,
        payload :{
            getAllCategory,
        }
    })
    } catch (error) {
        next(error);
    }
}

const getCategory=async(req,res,next)=>{
    try {
        const {slug} = req.params;
        const getCategoryOne = await getCategorys(slug);
       return responseUser(res,{
        statusCode : 202,
        message : `fatching one category successfully`,
        payload :{
            getCategoryOne,
        }
    })
    } catch (error) {
        next(error);
    }
}

const updateCategory=async(req,res,next)=>{
    try {
        const {name} = req.body;
        const {slug} = req.params;

        const result = await categoryUpdate(name,slug);
        
       return responseUser(res,{
        statusCode : 202,
        message : `category was created successfully`,
        payload :{
            result,
        }
    })
    } catch (error) {
        next(error);
    }
}


const deleteCategory=async(req,res,next)=>{
    try {
        const {slug} = req.params;

        const result = await categoryDelete(slug);
        
       return responseUser(res,{
        statusCode : 202,
        message : `category was delete successfully`,
    })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};

