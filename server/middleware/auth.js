const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = async(req, res, next) => {

    const { token } = req.cookies;

    try {
        if (!token) {
            res.status(401).json("Please login to access this resource.");
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);

        next();
    } catch (error) {
        console.log(`error accoured :>> ${error}`);
        res.status(401).json({ message: `Authorization Token Isn\'t Valid, Authorization Failed! ${error}` });

    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {

        try {
            if (!roles.includes(req.user.role)) {
                res.status(403).json(`${req.user.role} is not allowed to access this resource.`);
            }

            next();

        } catch (error) {
            console.log(error);
            res.status(error);
        }
    }
}