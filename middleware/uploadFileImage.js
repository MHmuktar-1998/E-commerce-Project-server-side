const multer = require("multer");
require('dotenv').config();
const path = require("path");

const maxImageSize = Number(process.env.MAX_FILE_SIZE) || 2097152 ;
const uploadFileName = process.env.UPLOAD_USER_FILE_NANE || 'public/img/user';
const uploadProdutFileName = process.env.UPLOAD_PRODUCT_FILE_NANE || 'public/img/product';
const typeAlowedFile = process.env.ALOWED_FILE_TYPE || ['png','jpeg','jpg'];



const storage = multer.diskStorage(
  // this for string type images uploads
  {
    // destination: function (req, file, cb) {
    //   cb(null, uploadFileName) 
    // },
    
    filename: function (req, file, cb) {
     const extname = path.extname(file.originalname);
     cb(null,Date.now() + '-' + file.originalname.replace(extname,'') +  extname);
    }
  }
)
//image for products
const productStorage = multer.diskStorage(
  // this for string type images uploads
  {
    // destination: function (req, file, cb) {
    //   cb(null, uploadProdutFileName) 
    // },
    filename: function (req, file, cb) {
     const extname = path.extname(file.originalname);
     cb(null,Date.now() + '-' + file.originalname.replace(extname,'') +  extname);
    }
  }
)

  const filterImage =(req,file,cb)=>{
    // below coments for string type image uploads
     const extname = path.extname(file.originalname);
     if(!typeAlowedFile.includes(extname.substring(1))){
        return cb(createError(404,'type is not allowed'));
     }
     cb(null,true);
  }
  
  const upload = multer({ 
    storage: storage,
   limits : { fileSize : maxImageSize},
    // fileFilter : filterImage
   })

   const productUpload = multer({ 
    storage: productStorage,
    limits : { fileSize : maxImageSize},
     fileFilter : filterImage
    })
  module.exports = {upload,productUpload}