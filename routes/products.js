const {  Category } = require('../models/Category')
const { product } = require('../models/products')
const express = require('express')

const router = express.Router()

// Get all products

router.get('/', async (req, res) => {
        const productList = await product.find().populate('category');
        
        if (!productList) { 
            res.status(500).json ({  success: false });
        }
        
        res.send(productList);
       
});


router.post('/products', async (req, res) => {
    
});








module.exports = router 