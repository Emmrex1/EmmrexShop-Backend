const { Category } = require('../models/Category.js'); 
const express = require('express');
const router = express.Router();
require('dotenv').config();
const cloudinary = require('cloudinary').v2;


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, 
});

let pLimit;
(async () => {
    const { default: importedPLimit } = await import('p-limit');
    pLimit = importedPLimit;
})();

router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.find();
        if (!categoryList) {
            return res.status(500).json({ success: false });
        }
        res.send(categoryList);
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
});

router.get('/:id',async (req, res) => {

  const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(500).json({ success: false, message: "Category not found" });
        }
        return res.send(category);   
});

router.delete('/:id',async (req, res) =>{

        const deleteUser = await Category.findByIdAndDelete(req.params.id);
        if (!deleteUser) {
            res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json ({
            success: true,
            message: "Category deleted successfully",

        });

})



router.post('/create', async (req, res) => {
    try {
        const limit = pLimit(2);
        const imagesToUpload = req.body.images.map((image) => {
            return limit(async () => {
                const result = await cloudinary.uploader.upload(image);
                return result;
            });
        });

        const uploadStatus = await Promise.all(imagesToUpload);
        const imgurl = uploadStatus.map((item) => item.secure_url);

        if (!uploadStatus) {
            return res.status(500).json({ error: "Image not uploaded", success: false });
        }

        let category = new Category({
            name: req.body.name,
            images: imgurl,
            color: req.body.color,
        });

        category = await category.save();

        res.status(201).json({ success: true, category });
    } catch (err) {
        res.status(500).json({ error: err.message, success: false });
    }


router.put('/:id', async (req, res) => {
    try {
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

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                images: imgurl,
                color: req.body.color,
            },
            { new: true }
        );

        if (!category) {
            return res.status(500).json({ success: false, message: "Category could not be updated" });
        }

        res.status(200).json({ success: true, category });
    } catch (err) {
        res.status(500).json({ error: err.message, success: false });
    }
});


});

module.exports = router;
