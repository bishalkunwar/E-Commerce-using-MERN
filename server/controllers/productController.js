const express = require("express");

const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");



// create products controller.

exports.createProduct = async(req, res) => {

    req.body.user = req.user.id;
    // const product = req.body;
    // const newProduct = new Product({...product });

    try {
        // await newProduct.save();
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product })

    } catch (error) {
        console.log(`error while creating the product :>> ${error}`);
        res.status(409).json({ success: false, message: error.message });
    }

};


// Get all products controller.
exports.getAllProducts = async(req, res) => {

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    try {
        const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
        const products = await apiFeatures.query;

        res.status(200).json({ success: true, products, productsCount, resultPerPage, });

    } catch (error) {
        console.log(`error while fetching all products :>> ${error}`);
        res.status(404).json({ success: false, message: error.message });
    }

};


//Get all products (admin)
exports.getAdminProducts = async(req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, products, });
    } catch (error) {
        res.status(404).json(error);
    }
};


// Get specific product by id.
exports.getProduct = async(req, res) => {
    const product = await Product.findById(req.params.id);

    try {

        if (!product) {
            return res.status(500).json({ success: false, message: "Product not found" });
        }
        // const product = await Product.findById(id);
        res.status(200).json({ success: true, product });

    } catch (error) {
        console.log(`error while fetching the product:>> ${error}`);
        res.status(404).json({ success: false, message: error.message });
    }
};


// update products controller.
exports.updateProduct = async(req, res) => {
    let product = await Product.findById(req.params.id);

    try {
        if (!product) {
            return res.status(500).json({ success: false, message: "Product not found" });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {
        console.log(`error at updating product:>>${error}`);
        res.status(404).json({ message: error.message });

    }
};


// Deleting a product.
exports.deleteProduct = async(req, res) => {
    const product = await Product.findById(req.params.id);

    try {
        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product not found or is invalid"
            });
        }

        await product.remove();

        res.status(200).json({
            success: true,
            message: "Product has been deleted succcessfully"
        });

    } catch (error) {
        console.log(`error held while to delete the product:>>${error}`);
        res.status(404).json({ message: error.message });
    }

};


// Getting started with Reviews and Ratings.
// Create or Update the review. || explain:: as the same user again gives review or ratings it gets updated despited being to be created again.

exports.createProductReview = async(req, res) => {

    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    try {
        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user._id.toString())
                    (rev.rating = rating), (rev.comment = comment);
            });

        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let average = 0;
        product.reviews.forEach((rev) => {
            average += rev.rating;
        });

        product.ratings = average / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, message: "review and rating has been applied now." });
    } catch (error) {
        console.log(`Bad Request error. :>> ${error}`);
        res.status(409).json({ success: false, message: error.message });
    }
};


// Get all review of a specific product.
exports.getProductReviews = async(req, res) => {

    try {
        const product = await Product.findById(req.query.id);
        if (!product) {
            res.status(404).json("product not found");
        }

        const review = product.reviews;
        res.status(200).json({ success: true, review });

    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};


// Delete Review.
exports.deleteReview = async(req, res, next) => {
    try {
        const product = await Product.findById(req.query.productId);

        if (!product) {
            res.status(404).json("Product not found");
            next();
        }

        const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

        let average = 0;
        reviews.forEach((rev) => {
            average += rev.rating;
        });

        let ratings = 0;

        if (reviews.length === 0) {
            ratings = 0;
        } else {
            ratings = average / reviews.length;
        }

        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(
            req.query.productId, { reviews, ratings, numOfReviews, },

            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({ success: true });

    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }

};