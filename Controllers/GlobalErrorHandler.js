const CustomError = require('./../Utils/CustomError');

const asyncErHandler = (func) =>{
    return (req,res,next) =>{
        func(req,res,next).catch(err => next(err));
    }
}

const devError = (res,err) =>{
    
    err.statusCode = err.statusCode || 500
    res.status(err.statusCode).json({
        status:err.statusCode,
        message:err.message,
        stackTrace:err.stack
    })
}

const tokenErr = (err) =>{
    const msg = 'Invalid Token, please log in again';
    err.message = msg;
    return new CustomError(msg,401);
}

const prodError = (res,err) =>{
    if(err.isOpretional){
        res.status(err.statusCode).json({
            status:err.statusCode,
            message:err.message,
        })
    }else{
        res.status(500).json({
            status:'error',
            message:"Something is causing an error, please try again later",
        })
    }
}
/*const prodErrors = (res, error) => {
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    }else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.'
        })
    }
}
 */

const errorHandler = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development'){
        devError(res,err)
    }
    else if(process.env.NODE_ENV === 'production'){ 
        if(err.name === 'JsonWebTokenError') { err = tokenErr(err)}
        prodError(res,err);
    }   
}

module.exports ={errorHandler,asyncErHandler};