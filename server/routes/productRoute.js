const express = require("express");

const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, getAdminProducts, createProductReview, getProductReviews, deleteReview } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/admin/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
// router.route("/products/new").post(createProduct);
router.route("/product/:id").get(getProduct);
router.route("/products").get(getAllProducts);
router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router.route("/admin/product/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router.route("/review").put(isAuthenticatedUser, createProductReview).get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;