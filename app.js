const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");

//database link
require("./config/database");



//bellow for how much time to try request
const { rateLimit } = require('express-rate-limit');
const router = require('./router/user.router');
const seedRouter = require('./router/user.seed');
const { errorResponseRoute, errorResponseServer } = require('./controller/user.responseController');
const authLogged = require('./router/auth.router');
const categoris = require('./router/category.router');
const productRouter = require('./router/product.router');


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
});
// Apply the rate limiting middleware to all requests.
app.use(cookieParser());
app.use(limiter)
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));


//routing here
app.use("/api/user",router);
app.use("/api/seed",seedRouter);
app.use("/api/auth",authLogged);
app.use("/api/categoris",categoris);
app.use("/api/product",productRouter);

//home route
app.get('/',(req,res)=>{
    res.status(200).send('api testing successfull');
})


//url error route 
app.use((req,res,next)=>{
    return errorResponseRoute(res,{
        statusCode : 400,
        message : "wrong url"
    })
})

//server error uroute 
app.use((err,req,res,next)=>{
    return errorResponseServer(res,{
        statusCode : err.status,
        message : err.message,
    })
})

module.exports = app;