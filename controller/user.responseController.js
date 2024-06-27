

const errorResponseRoute =(res,{statusCode = 404, message = 'internal route error'})=>{
    return res.status(statusCode).json({
        success : false,
        message,
    })
}

const errorResponseServer =(res,{statusCode = 500, message = 'internal server error'})=>{
    return res.status(statusCode).json({
        success : false,
        message,
    })
}

const responseUser =(res,{statusCode = 200, message = 'user successfully get', payload = {}})=>{
    return res.status(statusCode).json({
        success : true,
        message,
        payload,
    })
}

module.exports = {errorResponseRoute,errorResponseServer,responseUser};