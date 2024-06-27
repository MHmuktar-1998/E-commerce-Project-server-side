
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        require : [true,'category name is required'],
        trim : true,
        unique: true,
        minlength : [3,'user name must be 3 characters'],
        maxlength : [31,'user name maximum 31 characters']
    },
   slug : {
    type : String,
    require : [true,'category slug is required'],
    trim : true,
    unique : true,
   }
},{timestamps : true});

const category = mongoose.model('category', categorySchema);

module.exports = category;