const express = require('express');
const {runValidation} = require('../validators');
const {isLoggedIn, isAdmin} = require('../middleware/auth');
const { productCreation, handleGetAllProducts, handleGetProduct, handleDeletProduct, handleUpdateProduct } = require('../controller/productController');
const { validationProducts } = require('../validators/productValidation');
const { productUpload } = require('../middleware/uploadFileImage');
const path = require('path');
const productRouter = express.Router();



productRouter.post("/",
    productUpload.single("image"),
    validationProducts,
    runValidation,
    // isLoggedIn,
    // isAdmin,
    productCreation,
);

productRouter.get("/",
  
    // isLoggedIn,
    // isAdmin,
    handleGetAllProducts,
);

productRouter.get("/:slug",
  
    // isLoggedIn,
    // isAdmin,
    handleGetProduct,
);

productRouter.delete("/:slug",
    // isLoggedIn,
    // isAdmin,
    handleDeletProduct,
);

productRouter.put("/:slug",

    productUpload.single("image"),
  
    // isLoggedIn,
    // isAdmin,
    handleUpdateProduct,
);




module.exports = productRouter;