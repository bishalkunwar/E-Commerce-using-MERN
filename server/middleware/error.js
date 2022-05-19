const ErrorHandler = require("../utils/errorhander");

module.exports=(err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong MongoDb id error.
    if(err.name === "CaseError"){
        const message = `Resource node foung.Invalid:${err.path}`;
        err = new ErrorHandler(message, 400);

    }

    // Mongoose Duplicate key error.
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    // wrong JWT error.
    if(err.code === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, Try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });


}

