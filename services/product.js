const { publicIdWithoutExtentionFromUrl, deletePublicId } = require("../helper/cloudinaryHelper");
const deleteImg = require("../helper/deleteImage");
const Products = require("../model/productModel");
const cloudinary = require("../config/cloudinary");

const createError = require('http-errors');
const slugify = require("slugify");
const createProduct=async(productData,image)=>{
    
    if(!image){
        throw createError(404,'file is not required');  
    }
    if(image.size > 1024*1024 *2){
        throw createError(404,'image file size is too large');
    }

    const product = await Products.create(productData);
    if(!product){
        throw createError(404,'product not found')
    }
    return product;
}

const getAllProducts=async(page=1,limit=4,filters={})=>{

    const products = await Products.find(filters)
        .populate('category')
        .skip((page-1)* limit)
        .limit(limit)
        .sort({createdAt:-1});
        if(!products) throw createError(404,'products not found');
        
        const count = await Products.find(filters).countDocuments();

        return {products,count}
}

const getOneProduct=async(slug)=>{

    const product = await Products.findOne({slug});

    if(!product) throw createError(404,'single product not found');

    return product;
}


const deletOneProduct=async(slug)=>{

    const product = await Products.findOneAndDelete({slug});

    if(product && product.image){
        const publicId = await publicIdWithoutExtentionFromUrl(product.image);
        console.log(publicId);
            await deletePublicId('product/data',publicId,'product');
    }

    if(!product) throw createError(404,'single product not found');
   
//    if(product.image){
//       await deleteImg(product.image);
//   }
    return product;
}

const updateProductBySlug=async(slug,req)=>{
    try {
        const product = await Products.findOne({slug});

        const updateOptions = {new : true,runValidators:true,context:'query'};
         let updates ={};
        const allowedFields =[
            'name',
            'description',
            'price',
            'sold',
            'quantity',
            'shiping',
        ];

        for(const key in req.body){
            if(allowedFields.includes(key)){
                updates[key] = req.body[key];
            }
        }

        if(updates.name){
            updates.slug = slugify(updates.name);
        }

        const image = req.file?.path;
        
        if(image){
            if(image.size > 1024*1024*2){
                throw createError(404,'image size is too large');
            }

            if(image){
                const responseimage = await cloudinary.uploader
                .upload(image,{folder: 'product/data'});
                updates.image = responseimage.secure_url;
               }else{
                    console.log('not upload cloudinary');
               }
            

            //local update functions
            // product.image !== 'default.png' && deleteImg(product.image);  
        }
        const updateProducts = await Products.findOneAndUpdate(
            {slug},
            updates,
            updateOptions,
        );
        console.log(updates);
        if(!updateProducts){
            throw createError(404,'can not update data');
        }
        if(product && product.image){
            const publicId = await publicIdWithoutExtentionFromUrl(product.image);
            console.log(publicId);
                await deletePublicId('product/data',publicId,'product');
        }
        return updateProducts;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    createProduct,
    getAllProducts,
    getOneProduct,
    deletOneProduct,
    updateProductBySlug,
}