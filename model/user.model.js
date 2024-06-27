
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        require : [true,'Use is required'],
        trim : true,
        minlength : [3,'user name must be 3 characters'],
        maxlength : [31,'user name maximum 31 characters']
    },
    email : {
        type : String,
        require : [true, 'email is required'],
        unique : true,
        match : /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/ ,
        trim : true,
       validator :{
         validate : function(email) {
            const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return re.test(email)
        }},
        message : "please fill the email",
    },
    password : {
        type : String,
        require : [true, 'User password is required'],
        minlength : [6, 'password must be 6 characters'],
        set : (v)=> bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    image : {
        type : String,
        contentType : String,
        require : [true, 'image is required'],

    },
    phone : {
        type : String,
        require : [true, 'phone is required']
    },
    address : {
        type : String,
        require : [true, 'address is required'],
        trim : true,
        minlength : [3,'user name must be 3 characters'],
        maxlength : [31,'user name maximum 31 characters']
    },
    isAdmin : {
        type : Boolean,
        default : false,
    },
    isBanned :{
        type : Boolean,
        default : false,
    }
},{timestamps : true});

const User = mongoose.model('user', userSchema);

module.exports = User;