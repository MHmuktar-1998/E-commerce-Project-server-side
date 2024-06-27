const createError = require("http-errors");
const { findItems } = require("../services/findItem");
const Products = require("../model/productModel");
const { default: slugify } = require("slugify");
const { responseUser } = require("./user.responseController");
const { createProduct, getAllProducts, getOneProduct, deletOneProduct, updateProductBySlug } = require("../services/product");

const deleteImg = require("../helper/deleteImage");
const cloudinary = require("../config/cloudinary");
const productCreation=async(req,res,next)=>{
    try {
       const {name,description,price,quantity,shiping,category} = req.body;
      
       let image = req.file?.path;
       console.log(image);
       if(image){
        const responseimage = await cloudinary.uploader
        .upload(image,{folder: 'product/data'});
              image =  responseimage.secure_url;
       }else{
            console.log('not upload cloudinary');
       }
      
        

       const exitsProducts = await Products.exists({name});
       if(exitsProducts){
        throw createError(409, 'product with this name already exits.please make a new product');
       }
        
       //create products
       const productsData = {
        name: name,
        slug : slugify(name),
        description: description,
        price: price,
        quantity: quantity,
        shiping: shiping,
        category : category,
        image: image,
       }

       const products = await createProduct(productsData,image);

       return responseUser(res,{
            statusCode : 202,
            message : `product was created successfully`,
            payload :{
                products
            },
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}


const handleGetAllProducts=async(req,res,next)=>{
    try {
       const search = req.query.search || '' ;
       const page = req.query.page || 1;
       const limit = req.query.limit || 2;

         //regular express search values logic 
         const regExSearch = new RegExp('.*' + search + '.*' , 'i');
         const filters = {
             $or : [
                 {name : {$regex : regExSearch }},
                 {slug : {$regex : regExSearch }},
             ]
         }

        const productsDate = await getAllProducts(page,limit,filters);

       return responseUser(res,{
            statusCode : 202,
            message : `all product was found successfully`,
            payload :{
                products: productsDate.products,
                pagination: {
                    numberOFAllPage : productsDate.count,
                    totalPage : Math.ceil(productsDate.count/limit),
                    currentPage: page,
                    previousPage: page - 1,
                    nextPage : page + 1
                }
            },
        })
    } catch (error) {
        next(error);
    }
}

const handleGetProduct=async(req,res,next)=>{
    try {
        
        const {slug}= req.params;
       const product = await getOneProduct(slug);

       return responseUser(res,{
            statusCode : 202,
            message : `product was found successfully`,
            payload :{
                product
            },
        })
    } catch (error) {
        next(error);
    }
}

const handleDeletProduct=async(req,res,next)=>{
    try {
        
        const {slug}= req.params;
         await deletOneProduct(slug);
    
       return responseUser(res,{
            statusCode : 202,
            message : `product was delete successfully`,
            payload :{

            },
        })
    } catch (error) {
        next(error);
    }
}

const handleUpdateProduct=async(req,res,next)=>{
    try {
        
        const {slug}= req.params;
       const updateProducts = await updateProductBySlug(slug,req);
       return responseUser(res,{
            statusCode : 202,
            message : `product was update successfully`,
            payload :{
                updateProducts
            },
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    productCreation,
    handleGetAllProducts,
    handleGetProduct,
    handleDeletProduct,
    handleDeletProduct,
    handleUpdateProduct,
};


