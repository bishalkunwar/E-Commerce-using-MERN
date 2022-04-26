const ErrorHander = require("../utils/errorhander");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");


// Register a user.
exports.registerUser = async(req, res) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale",
    });
    const { name, email, password } = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password,
            avatar: { public_id: myCloud.public_id, url: myCloud.secure_url, },
        });

        const token = user.getJWTToken();

        res.status(201).json({ success: true, token, user, });

    } catch (error) {
        console.log(`error on user registration:>>${error}`);
        res.status(409).json({ message: error.message });

    }

};


// Login User.
exports.loginUser = async(req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return next(new ErrorHander("Please Enter Email & Password", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHander("Invalid email or password", 401));
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHander("Invalid email or password", 401));
        }

        sendToken(user, 200, res);

    } catch (error) {
        console.log(`error while user logging in :>> ${error}`);
        res.status(409).json({ message: error.message });
    }
};


// Logout user.
exports.logout = async(req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })

        res.status(200).json({ success: true, message: "Logged Out" });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


// Forget Password.
exports.forgotPassword = async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    try {
        if (!user) {
            return next(new ErrorHander("User not found", 404));
        }

        // Get Reset Password Token::
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${req.protocol}://${req.get(
            "host" )}/password/reset/${resetToken}`;

        const message = `Your Password Reset Token is :-- \n\n${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it.`;

        try {
            await sendEmail({
                email: user.email,
                subject: `E-Commerce Password Recovery`,
                message,
            });

            res.status(200).json({
                success: true,
                message: `Email sent to user ${user.email} successfully.`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

           return next(new ErrorHander(error.message, 500));

        }

    } catch (error) {
        return next(new ErrorHander(error.message, 500));

    }
};


// Reset Password ::
exports.resetPassword = async(req, res) => {
    // creating token hash.
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400).json("Reset password token is invalid or is expired.");
    };

    if (req.body.password !== req.body.confirmPassword) {
        res.status(400).json("Password does not matches.");
    };

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
};


// Get User Detail ::
exports.getUserDetails = async(req, res) => {
    // const user = await user.findById(req.user.id);
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });

    } catch (error) {
        res.status(400).json(`No Authority to get the details.${error}`);
    }
};


// Update user password ::
exports.updatePassword = async(req, res) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        res.status(400).json("Old Password is not correctly typed.");
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        res.status(400).json("Passwords does not match");
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
};



// Update user profile :::
exports.updateProfile = async(req, res, next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    try {
        if(req.body.avatar!==""){
            const user = await User.findById(req.user.id);

            const imageId = user.avatar.public_id;

            await cloudinary.v2.uploader.destroy(imageId);

            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder:"avatars",
                width:150,
                crop:"scale",
            });

            newUserData.avatar={
                public_id:myCloud.public_id,
                url:myCloud.secure_url,
            };
        }

        const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
            new:true, runValidators:true, useFindAndModify:false,
        });

        res.status(200).json({success:true,});
    } catch (error) {
        res.status(error);
    }
};


// Get all users (admin):
exports.getAllUsers = async(req, res) => {

    try {
        const users = await User.find();
        res.status(200).json({ success: true, users, });

    } catch (error) {
        res.status(404).json(error); // error code 404 means not found it is implemented wrong here only error code

    }
}


// Get single users (admin) :
exports.getSingleUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.send(404).json(`user does not exists with user id:> ${req.params.id}`);
        };

        res.status(200).json({
            status: true,
            user,
        });
    } catch (error) {
        res.status(404).json(error);
    }
};


// update user role
exports.updateUserRole = async(req, res) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    try {
        await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({ success: true, message: "role has been changed now." });

    } catch (error) {
        res.status(404).json(error);
    }
};


// Delete user role 
exports.deleteUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(400).json(`User does not exist with the id ${req.params.id}`);
        }

        // const imageId = user.avatar.public_id;
        // await cloudinaray.v2.uploader.destroy(imageId);
        await user.remove();

        res.status(200).json({
            success: true,
            message: "User deleted Successfully",
        });

    } catch (error) {
        res.staus(400).json(error);
    }
};