const ProductRams = require("../../models/productRams");
const express = require("express");
const router = express.Router();

const handleError = (res, err, message = 'An error occurred') => {
    console.error(message, err);
    return res.status(500).json({ success: false, error: message, details: err.message });
};

// Get all Product RAMs
router.get('/', async (req, res) => {
    try {
        const productRAMSList = await ProductRams.find();
        if (!productRAMSList.length) {
            return res.status(200).json([]);
        }
        res.status(200).json(productRAMSList);
    } catch (error) {
        handleError(res, error, "Error fetching product RAMs.");
    }
});


router.get('/:id', async (req, res) => {
    try {
        const productRAMS = await ProductRams.findById(req.params.id);
        if (!productRAMS) {
            return res.status(400).json({ success: false, error: "Product RAM not found." });
        }
        res.status(200).json(productRAMS);
    } catch (error) {
        handleError(res, error, "Error fetching product RAM by ID.");
    }
});

// Create a new Product RAM
router.post('/create', async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ message: 'Name is required', success: false });
        }
        let productRAMS = new ProductRams({ name: req.body.name });
        productRAMS = await productRAMS.save();
        res.status(201).json({ success: true, productRAMS });
    } catch (err) {
        handleError(res, err, "Error creating Product RAM.");
    }
});

// Update a Product RAM
router.put('/:id', async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ message: 'Name is required', success: false });
        }
        const updatedItem = await ProductRams.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found', success: false });
        }
        res.status(200).json({ success: true, updatedItem });
    } catch (err) {
        handleError(res, err, "Error updating Product RAM.");
    }
});

// Delete a Product RAM
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await ProductRams.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found', success: false });
        }
        res.status(200).json({ success: true, message: 'Item deleted' });
    } catch (err) {
        handleError(res, err, "Error deleting Product RAM.");
    }
});

module.exports = router;
