const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");

//const errorMiddleware = require("./middleware/error");

// Config

dotenv.config({ path: "server/config/config.env" });

// if (process.env.NODE_ENV !== "PRODUCTION") {
//     require("dotenv").config({ path: "backend/config/config.env" });
// }

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads"));
//app.use(fileUpload());

// Route Imports
const product = require("./routes/productRoute");
// const category = require("./routes/categoryRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
//const foods = require("./routes/foodsRoute");

app.use("/api/v1", product);
// app.use("/api/v1", category);
app.use("/api/v1", user);
app.use("/api/v1", order);
//app.use("/api/v1", foods);



// Middleware for Errors
// app.use(errorMiddleware);

module.exports = app;