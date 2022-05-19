const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "nep",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});


















// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// exports.processPayment =  async(req, res)=>{
//     try {
//        const myPayment = await stripe.paymentIntents.create({
//            amount:req.body.amount,
//            currency:"NRS.",
//            metadata:{
//                company:"Bishal_mart",
//            },
//        });
//        res.status(200).json({success:true, client_secret:myPayment.client_secret});
//     } catch (error) {
//         res.status(error);
//     }
// };

// exports.sendStripeApiKey=async(req,res)=>{
//     try {
//       res.status(200).json({stripeApiKey:process.env.STRIPE_API_KEY});  
//     } catch (error) {
//         res.status(error);      
//     }
// };