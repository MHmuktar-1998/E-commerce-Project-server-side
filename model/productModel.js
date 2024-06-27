
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//name,slug,description,price, quantity,sold,shiping,image
const productSchema = new mongoose.Schema({
    name : {
        type : String,
        require : [true,'product name is required'],
        trim : true,
        unique: true,
        minlength : [3,'user name must be 3 characters'],
        maxlength : [31,'user name maximum 31 characters']
    },
   slug : {
    type : String,
    require : [true,'product slug is required'],
    trim : true,
    unique : true,
   },
   description : {
    type : String,
    require : [true,'product desctription is required'],
    trim : true,
    unique: true,
    minlength : [3,'user name must be 3 characters'],
    maxlength : [300,'user name maximum 300 characters']
},
price : {
    type : Number,
    require : [true,'product price is required'],
    validate : {
        validator : (v)=> v > 0,
        message: (props)=> `${props.value} is must be greater than 0`,
    },
},
quantity : {
    type : Number,
    require : [true,'product quantity is required'],
    validate : {
        validator : (v)=> v > 0,
        message: (props)=> `${props.value} is must be greater than 0`,
    },
},
sold : {
    type : Number,
    default: 1,
    require : [true,'product sold is required'],
    validate : {
        validator : (v)=> v > 0,
        message: (props)=> `${props.value} is must be greater than 0`,
    },
},
shiping :{
    type : Number,
    default :0
},
image : {
    type : String,
    contentType : String,
    require : [true, 'image is required'],
    url:{type:String, required:true},
},
category : {
    type: Schema.Types.ObjectId,
    ref :'category',
    require: true,
}
},{timestamps : true});

const Products = mongoose.model('products', productSchema);

module.exports = Products;