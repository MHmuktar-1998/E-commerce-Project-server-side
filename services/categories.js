const { default: slugify } = require("slugify");
const category = require("../model/categoryModel");
const createError = require('http-errors');
const ceateCategorisService = async(name)=>{
    try {
        const categorisCreate = await category.create({
            name : name,
            slug : slugify(name)
        });
       
        const isExitsData = await category.exists({name}) ;
        if(isExitsData === name){
            throw createError(404,'data is available in categoris');
        }
      return categorisCreate;
    } catch (error) {
        throw error;
    }
}

const getCategoris=async()=>{
   const getAllCategory =  await category.find({});
   return getAllCategory;
}

const getCategorys=async(slug)=>{
    const getCategoryOne = await category.find({slug}).select('name slug').lean();
    return getCategoryOne;
 }
 const categoryUpdate=async(name,slug)=>{
    const filter = {slug};
    const updates = {$set:{name : name,slug: slugify(name)}};
    const options = {new : true};
    const result = await category.findOneAndUpdate(
        filter,updates,options
    );
    if(!result){
        throw createError(404,'category not updated')
    }
    return result;
 }

 const categoryDelete=async(slug)=>{
    const isExits = await category.findOne({slug});
    if(isExits){
        const result = await category.findOneAndDelete(
            slug
        );
        if(!result){
            throw createError(404,'category not deleted')
        }
    }else{
        throw createError(404,'category not found');
    }
    
 }
module.exports = {
    ceateCategorisService,
    getCategoris,
    getCategorys,
    categoryUpdate,
    categoryDelete,    
}