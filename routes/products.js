const express = require('express');
const Product = require('../models/products');
const { uploadImageToCloudinary } = require('../util/cloudinary');
require('dotenv').config();
const upload = require('../middleware/multer'); 

const router = express.Router();


router.post('/create', upload.array('images', 5), async (req, res) => {
    try {
        // console.log("Uploaded files:", req.files); 
        const { name, description, category, brand, price, oldPrice } = req.body;

        
        const isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
        const countInStock = parseInt(req.body.countInStock || 0, 10);
        const rating = parseFloat(req.body.rating || 0);


        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded', success: false });
        }

        
        const imagesToUpload = files.map((file) => uploadImageToCloudinary(file.path));
        const uploadStatus = await Promise.all(imagesToUpload);
        const imgUrls = uploadStatus.map((item) => item.secure_url);

        if (!imgUrls || imgUrls.length === 0) {
            return res.status(500).json({ error: 'Image upload failed', success: false });
        }

        
        const newProduct = new Product({
            name,
            description,
            images: imgUrls,
            brand,
            price,
            oldPrice,
            category,
            countInStock,
            rating,
            isFeatured,
        });

        const savedProduct = await newProduct.save();
        
        res.status(200).json({
         success: true,
         message: "Product created successfully",
         product: {
        ...savedProduct._doc,
        images: req.files.map(file => file.path), 
    },
});

        // console.log('Created Product:', savedProduct);

    } catch (err) {
        console.error('Error in product creation:', err);
        res.status(500).json({ error: err.message, success: false });
    }
});


router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'price', order = 'asc', category } = req.query;

        const filter = {};
        if (category) filter.category = category;

        const skip = (page - 1) * limit;
        const sortOrder = order === 'asc' ? 1 : -1;

        const products = await Product.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ [sort]: sortOrder });

        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: products,
            total: totalProducts,
            page: parseInt(page),
            totalPages: Math.ceil(totalProducts / limit),
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: err.message, success: false });
    }
});


router.put('/:id', async (req, res) => {
    try {
        let imgUrls = req.body.images;

        if (req.body.images && Array.isArray(req.body.images)) {
            const uploadPromises = req.body.images.map((image) =>
                uploadImageToCloudinary(image)
            );

            const uploadStatus = await Promise.all(uploadPromises);
            imgUrls = uploadStatus.map((item) => item.secure_url);

            if (!uploadStatus) {
                return res.status(500).json({ error: 'Image upload failed', success: false });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                images: imgUrls,
                brand: req.body.brand,
                price: req.body.price,
                oldPrice: req.body.oldPrice,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                isFeatured: req.body.isFeatured,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (err) {
        res.status(500).json({ error: err.message, success: false });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (err) {
        res.status(500).json({ error: err.message, success: false });
    }
});

module.exports = router;
