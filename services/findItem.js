const  mongoose  = require("mongoose");
const createError = require("http-errors");


const findItems = async(Model,id,options={})=>{
     try {

     //find all data from databse through serch values
     const findItem = await Model.findById(id,options);

     //if user not found 
     if(!findItem) throw createError(404, `user not found from database`)
      
        return findItem;
     } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(404,'invalid user id');
        }
        throw error;
     }
}


module.exports = {findItems}