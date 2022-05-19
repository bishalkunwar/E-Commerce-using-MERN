const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});


















// const Order = require("../models/orderModel");
// const Product = require("../models/productModel");

// // Create a new order:
// exports.newOrder = async(req, res) => {
//     const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

//     try {
//         const order = await Order.create({ shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user._id, });
//         res.status(201).json({ success: true, order });
//     } catch (error) {
//         console.log(error);
//         res.status(409).json(error);

//     }
// };

// // Get Single Order.
// exports.getSingleOrder = async(req, res) => {

//     try {
//         const order = await Order.findById(req.params.id).populate(
//             "user", "name email"
//         );

//         if (!order) {
//             res.status(404).json("Order not found with this id.");
//         }

//         res.status(200).json({ success: true, order, });

//     } catch (error) {
//         console.log(error);
//         res.status(404).json(error);
//     }

// };

// // Get logged in user orders.
// exports.myOrders = async(req, res) => {
//     try {
//         const orders = await Order.find({ user: req.user._id });
//         res.status(200).json({ status: true, orders });

//     } catch (error) {
//         console.log(error);
//         res.status(404).json(error);
//     }
// };

// // Get all orders admin
// exports.getAllOrders = async(req, res) => {

//     try {
//         const orders = await Order.find();

//         let totalAmount = 0;
//         orders.forEach((order) => {
//             totalAmount += order.totalPrice;
//         });

//         res.status(200).json({ success: true, totalAmount, orders, });
//     } catch (error) {
//         res.status(404).json(error);
//         console.log(error);
//     }

// };


// // Update Order status by admin

// exports.updateOrder = async(req, res) => {
//     try {

//         const order = await Order.findById(req.params.id);

//         if (!order) {
//             res.status(404).json("No order found with this id.");
//         }

//         if (order.orderStatus === "Delivered") {
//             res.status(400).json("We have already delivered this order.");
//         }

//         if (req.body.status === "Shipped") {
//             order.orderItems.forEach(async(o) => {
//                 await updateStock(o.product, o.quantity);
//             });
//         }

//         order.orderStatus = req.body.status;

//         if (req.body.status === "Delivered") {
//             order.DeliveredAt = Date.now();
//         }

//         await order.save({ validateBeforeSave: false });

//         res.status(200).json({ success: true, });
//     } catch (error) {
//         res.status(404).json(error);
//         console.log(error);
//     }
// };

// async function updateStock(id, quantity) {
//     try {
//         const product = await Product.findById(id);

//         product.stock -= quantity;

//         await product.save({ validateBeforeSave: false });

//     } catch (error) {
//         res.status(404).json(error);
//         console.log(error);
//     }
// };

// // delete order -- admin.
// exports.deleteOrder = async(req, res) => {

//     try {
//         const order = await Order.findById(req.params.id);

//         if (!order) {
//             res.status(404).json("Order not found with this id.");
//         }

//         await order.remove();
//         res.status(200).json({ success: true, });
//     } catch (error) {
//         res.status(404).json(error);
//     }

// };