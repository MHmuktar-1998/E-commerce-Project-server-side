const Data = require("../data");
const User = require("../model/user.model");
const Products = require("../model/productModel");



const seedController=async(req,res,next)=>{
    try {
        await User.deleteMany({});

        //insert data logic
        const user = await User.insertMany(Data.users);

        //response successfull
        return res.status(202).json({
            success : true,
            user ,
        })

    } catch (error) {
        next(error);
    }
}

const seedProdect=async(req,res,next)=>{
    try {
        await Products.deleteMany({});
        //insert data logic
        const product = await Products.insertMany(Data.products);

        //response successfull
        return res.status(202).json({
            success : true,
            product ,
        })

    } catch (error) {
        next(error);
    }
}



module.exports = {seedController,seedProdect}