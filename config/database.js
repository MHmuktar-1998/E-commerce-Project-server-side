const mongoose = require('mongoose');
const { mongoDB_url } = require('../secret');
const logger = require('../controller/loggerController');


mongoose
.connect(mongoDB_url)
.then(()=>{
    logger.log('info',`your database is connected`);
})
.catch((err)=>{
    logger.log('error',`database is not connected`  + err);
})