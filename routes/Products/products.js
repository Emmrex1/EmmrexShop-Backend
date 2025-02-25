// Imports
const express = require('express');
const Product = require('../../models/products');
 const upload = require('../../middleware/multer');

const { getRelatedProducts,
    getAllProducts,
    getFeaturedProducts,
    getSingleProducts,
    getProductsByCategoryName,
    deleteProduct,recentlyviewedProduct,
    createProduct,
    updateProduct } = require('../../Controllers/productcontroller');
const { protect } = require('../../middleware/authmiddleware');

   require('dotenv').config();

const router = express.Router();



router.get("/related", getRelatedProducts);
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts)
router.get("/:id", getSingleProducts)
router.get("/category/:categoryName", getProductsByCategoryName)
router.delete("/:id",protect, deleteProduct)
router.post("/recently-viewed", recentlyviewedProduct)
router.post('/create',protect, upload.array('images', 5), createProduct)
router.put('/:id',protect, upload.array('images', 5), updateProduct)



module.exports = router;
