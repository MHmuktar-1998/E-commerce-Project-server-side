const cloudinary = require("cloudinary").v2;
// require('dotenv').config();
   // Configuration
   cloudinary.config({ 
    cloud_name: 'dsxm0hlxn', 
    api_key: '151992451587482', 
    api_secret: 't2hLsuRK6HXVzSVXkco7QMTnfNQ' // Click 'View Credentials' below to copy your API secret
});

module.exports = cloudinary;