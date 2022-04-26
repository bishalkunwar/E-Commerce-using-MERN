const ErrorHander = require("../utils/errorhander");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = async(req, res, next) => {

    try {
        const { token } = req.cookies;
        if (!token) {
            return next(new ErrorHander("Please Login to access this resource", 401));
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);

        next();
    } catch (error) {
        console.log(`error accoured :>> ${error}`);
        res.status(401).json({ message: `${error}` });

    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {

        try {
            if (!roles.includes(req.user.role)) {
                return next(
                  new ErrorHander(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                  )
                );
              }
          
              next();

        } catch (error) {
            console.log(error);
            res.status(error);
        }
    }
}