
const express = require("express");
const ProductSize = require("../../models/productSize");
const router = express.Router();

const handleError = (res, err, message = 'An error occurred') => {
    console.error(message, err);
    return res.status(500).json({ success: false, error: message, details: err.message });
};

router.get('/', async (req, res) => {
    try {
        const productSizeList = await ProductSize.find();
        if (!productSizeList.length) {
            return res.status(200).json([]); 
        }
        return res.status(200).json(productSizeList);
    } catch (error) {
        handleError(res, error, "Error fetching product size.");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const productSize = await ProductSize.findById(req.params.id);
        if (!productSize) {
            return res.status(400).json({ success: false, message: 'Product size not found.' });
        }
        return res.status(200).json(productSize);
    } catch (error) {
        handleError(res, error, "Error fetching product weight.");
    }
})
router.post('/create', async (req, res) => {
    let productSize = new ProductSize({ name: req.body.name})

    if(!productSize) {
        res.status(400).json({ error:err, success:false})
    }
    productSize = await productSize.save();
    res.status(201).json({ success:true, productSize })

})

router.put('/:id', async (req, res) => {
    const updatedItem = await ProductSize.findByIdAndUpdate(req.params.id,{name: req.body.name} , { new: true });
    
    if(!updatedItem) {
        res.status(500).json({
            message: 'Item can not be updated',
            success:false,
        })
    }
    res.status(200).json({ success: true, updatedItem })
})


router.delete('/:id', async (req, res) => {
    const deletedItem = await ProductSize.findByIdAndDelete(req.params.id);


if(!deletedItem) { 
    res.status(404).json({
         message: 'Item not found',
          success:false,
     })
}

    res.status(200).json({ success: true, message: 'Item deleted' })

}) 


module.exports = router;
