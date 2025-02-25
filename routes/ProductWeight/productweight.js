const ProductWeight = require("../../models/productWeight");
const express = require("express");
const router = express.Router();

const handleError = (res, err, message = 'An error occurred') => {
    console.error(message, err);
    return res.status(500).json({ success: false, error: message, details: err.message });
};

router.get('/', async (req, res) => {
    try {
        const productWeightList = await ProductWeight.find();
        if (!productWeightList.length) {
            return res.status(200).json([]); 
        }
        return res.status(200).json(productWeightList);
    } catch (error) {
        handleError(res, error, "Error fetching product weights.");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const productWeight = await ProductWeight.findById(req.params.id);
        if (!productWeight) {
            return res.status(400).json({ success: false, message: 'Product weight not found.' });
        }
        return res.status(200).json(productWeight);
    } catch (error) {
        handleError(res, error, "Error fetching product weight.");
    }
})

router.post('/create', async (req, res) => {
    let productWeight = new ProductWeight({ name: req.body.name})

    if(!productWeight) {
        res.status(500).json({ error:err, success:false})
    }
    productWeight = await productWeight.save();
    res.status(201).json({ success:true, productWeight })

})

router.put('/:id', async (req, res) => {
    const updatedItem = await ProductWeight.findByIdAndUpdate(req.params.id,{name: req.body.name} , { new: true });
    
    if(!updatedItem) {
        res.status(500).json({
            message: 'Item can not be updated',
            success:false,
        })
    }
    res.status(200).json({ success: true, updatedItem })
})


router.delete('/:id', async (req, res) => {
    const deletedItem = await ProductWeight.findByIdAndDelete(req.params.id);


if(!deletedItem) { 
    res.status(404).json({
         message: 'Item not found',
          success:false,
     })
}

    res.status(200).json({ success: true, message: 'Item deleted' })

}) 



module.exports = router;
