const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});


// const express = require("express");
// const cloudinary = require("cloudinary");
// const ErrorHander = require("../utils/errorhander");
// const Product = require("../models/productModel");
// const ApiFeatures = require("../utils/apifeatures");



// // create products controller.

// exports.createProduct = async(req, res) => {    

//     // const product = req.body;
//     // const newProduct = new Product({...product });

//     try {

//         let images = [];

//         if(typeof req.body.images === "string"){
//             images.push(req.body.images);
//         }else{
//             images=req.body.images;
//         }
    
//         const imagesLinks = [];
    
//         for(let i=0; i<images.length; i++){
//             const result = await cloudinary.v2.uploader.upload(images[i], {
//                 folder:"products",
//             });
    
//             imagesLinks.push({
//                 public_id:result.public_id,
//                 url:result.secure_url,
//             });
//         }
    
//         req.body.images = imagesLinks;
//         req.body.user = req.user.id;
    
//         const product = await Product.create(req.body);
    
//         // // await newProduct.save();
//         // const product = await Product.create(req.body);
//         res.status(201).json({ success: true, product })

//     } catch (error) {
//         console.log(`error while creating the product :>> ${error}`);
//         res.status(409).json({ success: false, message: error.message });
//     }

// };


// // Get all products controller.
// exports.getAllProducts = async(req, res) => {

//     const resultPerPage = 8;
//     const productsCount = await Product.countDocuments();
//     try {
//         const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter();
        
//         let products = await apiFeatures.query;
//         let filteredProductsCount = products.length;
//         apiFeatures.pagination(resultPerPage);
        
//         products = await apiFeatures.query;

//         res.status(200).json({ success: true, products, productsCount, resultPerPage, filteredProductsCount,});

//     } catch (error) {
//         console.log(`error while fetching all products :>> ${error}`);
//         res.status(404).json({ success: false, message: error.message });
//     }

// };


// //Get all products (admin)
// exports.getAdminProducts = async(req, res) => {
//     try {
//         const products = await Product.find();
//         res.status(200).json({ success: true, products, });
//     } catch (error) {
//         res.status(404).json(error);
//     }
// };


// // Get specific product by id.
// exports.getProduct = async(req, res) => {
//     const product = await Product.findById(req.params.id);

//     try {

//         if (!product) {
//             return res.status(500).json({ success: false, message: "Product not found" });
//         }
//         // const product = await Product.findById(id);
//         res.status(200).json({ success: true, product });

//     } catch (error) {
//         console.log(`error while fetching the product:>> ${error}`);
//         res.status(404).json({ success: false, message: error.message });
//     }
// };


// // update products controller.
// exports.updateProduct = async(req, res, next) => {
//     let product = await Product.findById(req.params.id);

//     try {
//         if (!product) {
//             return next (new ErrorHander("Product not found", 404));        
//         }

//         let images=[];

//         if(typeof req.body.images === "string"){
//             images.push(req.body.images);
//         }else{
//             images=req.body.images;
//         }

//         if(images !== undefined){
//             // Delete image from cloudinary.
//             for(let i = 0; i < product.images.length; i++){
//                 await cloudinary.v2.uploader.destroy(product.images[i].public_id);
//             }
//             const imagesLinks = [];

//             for(let i=0; i<images.length; i++){
//                 const result = await cloudinary.v2.uploader.upload(images[i], {
//                     folder:"products",
//                 });

//                 imagesLinks.push({
//                     public_id: result.public_id,
//                     url: result.secure_url,
//                 });
//             }

//             req.body.images = imagesLinks;

//         }

//         product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true,
//             useFindAndModify: false
//         });

//         res.status(200).json({
//             success: true,
//             product
//         })

//     } catch (error) {
//         console.log(`error at updating product:>>${error}`);
//         res.status(404).json({ message: error.message });

//     }
// };


// // Deleting a product.
// exports.deleteProduct = async(req, res) => {
//     const product = await Product.findById(req.params.id);

//     try {
//         if (!product) {
//              if (!product) {
//                 return next(new ErrorHander("Product not found", 404));
//                 }
//         }

//         // Deleting Images From Cloudinary
//         for (let i = 0; i < product.images.length; i++) {
//             await cloudinary.v2.uploader.destroy(product.images[i].public_id);
//         }


//         await product.remove();

//         res.status(200).json({
//             success: true,
//             message: "Product has been deleted succcessfully"
//         });

//     } catch (error) {
//         console.log(`error held while to delete the product:>>${error}`);
//         res.status(404).json({ message: error.message });
//     }

// };


// // Getting started with Reviews and Ratings.
// // Create or Update the review. || explain:: as the same user again gives review or ratings it gets updated despited being to be created again.

// exports.createProductReview = async(req, res) => {

//     const { rating, comment, productId } = req.body;
//     const review = {
//         user: req.user._id,
//         name: req.user.name,
//         rating: Number(rating),
//         comment,
//     };

//     try {
//         const product = await Product.findById(productId);

//         const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

//         if (isReviewed) {
//             product.reviews.forEach((rev) => {
//                 if (rev.user.toString() === req.user._id.toString())
//                     (rev.rating = rating), (rev.comment = comment);
//             });

//         } else {
//             product.reviews.push(review);
//             product.numOfReviews = product.reviews.length;
//         }

//         let average = 0;
//         product.reviews.forEach((rev) => {
//             average += rev.rating;
//         });

//         product.ratings = average / product.reviews.length;

//         await product.save({ validateBeforeSave: false });

//         res.status(200).json({ success: true, message: "review and rating has been applied now." });
//     } catch (error) {
//         console.log(`Bad Request error. :>> ${error}`);
//         res.status(409).json({ success: false, message: error.message });
//     }
// };


// // Get all review of a specific product.
// exports.getProductReviews = async(req, res) => {

//     try {
//         const product = await Product.findById(req.query.id);
//         if (!product) {
//             res.status(404).json("product not found");
//         }

//         const review = product.reviews;
//         res.status(200).json({ success: true, review });

//     } catch (error) {
//         res.status(404).json({ success: false, message: error.message });
//     }
// };


// // Delete Review.
// exports.deleteReview = async(req, res, next) => {
//     try {
//         const product = await Product.findById(req.query.productId);

//         if (!product) {
//             res.status(404).json("Product not found");
//             next();
//         }

//         const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

//         let average = 0;
//         reviews.forEach((rev) => {
//             average += rev.rating;
//         });

//         let ratings = 0;

//         if (reviews.length === 0) {
//             ratings = 0;
//         } else {
//             ratings = average / reviews.length;
//         }

//         const numOfReviews = reviews.length;

//         await Product.findByIdAndUpdate(
//             req.query.productId, { reviews, ratings, numOfReviews, },

//             {
//                 new: true,
//                 runValidators: true,
//                 useFindAndModify: false,
//             }
//         );

//         res.status(200).json({ success: true });

//     } catch (error) {
//         res.status(404).json({ success: false, message: error.message });
//     }

// };