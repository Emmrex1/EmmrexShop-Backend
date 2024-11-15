const { product } = require('../models/products');
const express = require('express');
const router = express.Router();
require('dotenv').config();
const { uploadImageToCloudinary } = require('../util/cloudinary');

let pLimit;

(async () => {
    const { default: importedPLimit } = await import('p-limit');
    pLimit = importedPLimit(2); 
})();

router.post('/create', async (req, res) => {
    try {

        if (!pLimit) {
            const { default: importedPLimit } = await import('p-limit');
            pLimit = importedPLimit(2);
        }

        const imagesToUpload = req.body.images.map((image) => 
            pLimit(async () => await uploadImageToCloudinary(image))
        );

        const uploadStatus = await Promise.all(imagesToUpload);
        const imgurl = uploadStatus.map((item) => item.secure_url);

        if (!uploadStatus) {
            return res.status(500).json({ error: "Image not uploaded", success: false });
        }

        let newProduct = new product({
            name: req.body.name,
            description: req.body.description,
            images: imgurl,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        });

        newProduct = await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message, success: false });
    }
});


router.put('/:id', async (req, res) => {
    try {
          if (!pLimit) {
            const { default: importedPLimit } = await import('p-limit');
            pLimit = importedPLimit(2);
        }

        let imgurl = req.body.images; 

        if (req.body.images && Array.isArray(req.body.images)) {
            const limit = pLimit(2);
            const imagesToUpload = req.body.images.map((image) => {
                return limit(async () => {
                    const result = await cloudinary.uploader.upload(image);
                    return result;
                });
            });

            const uploadStatus = await Promise.all(imagesToUpload);
            imgurl = uploadStatus.map((item) => item.secure_url);

            if (!uploadStatus) {
                return res.status(500).json({ error: "Image not uploaded", success: false });
            }
        }

        const product = await Category.findByIdAndUpdate(
            req.params.id,
            {
         name: req.body.name,
         description: req.body.description,
         images: imgurl,
         brand: req.body.brand,
         price: req.body.price,
         category: req.body.category,
         countInStock: req.body.countInStock,
         rating: req.body.rating,
         numReviews: req.body.numReviews,
         isFeatured: req.body.isFeatured,
            },
            { new: true }
        );

        if (!product) {
            return res.status(500).json({ success: false, message: "Category could not be updated" });
        }

        res.status(200).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message, success: false });
    }
});

router.delete('/:id',async (req, res) =>{

        const deleteUser = await Category.findByIdAndDelete(req.params.id);
        if (!deleteUser) {
            res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json ({
            success: true,
            message: "Product deleted successfully",

        });

})


module.exports = router;


