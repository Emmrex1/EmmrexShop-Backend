const express = require("express");
const { SubCategory } = require("../../models/SubCategory");
const { Category } = require("../../models/Category");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const totalPosts = await SubCategory.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({ success: false, message: "Page not found." });
    }

    const subCat = await SubCategory.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (!subCat.length) {
      return res.status(404).json({ success: false, message: "No Subcategories found." });
    }

  
    res.status(200).json({ success: true, subCategories: subCat, totalPages, page });
  } catch (error) {
    console.error("Error fetching subcategories:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const subCat = await SubCategory.findById(req.params.id).populate("category");

    if (!subCat) {
      return res.status(404).json({ success: false, error: "SubCategory not found." });
    }

    res.status(200).json({ success: true, subCategory: subCat });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error. Failed to fetch subcategory." });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { category, subCategory } = req.body;

    if (!category || !subCategory) {
      return res.status(400).json({ success: false, message: "Category and SubCategory are required." });
    }

    let categoryRecord;

    if (mongoose.Types.ObjectId.isValid(category)) {
      categoryRecord = await Category.findById(category);
    } else {
    
      categoryRecord = await Category.findOne({ name: category });
    }

    if (!categoryRecord) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    const newSubCategory = new SubCategory({
      category: categoryRecord._id, 
      subCategory,
    });
    await newSubCategory.save();

    res.status(201).json({
      success: true,
      subCategory: newSubCategory,
      message: "SubCategory created successfully.",
    });
  } catch (error) {
    console.error("Error creating subcategory:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});



router.put("/:id", async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!subCategory) {
      return res.status(404).json({ success: false, message: "SubCategory not found." });
    }

    res.status(200).json({ success: true, subCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

    if (!subCategory) {
      return res.status(404).json({ success: false, message: "SubCategory not found." });
    }

    res.status(200).json({ success: true, message: "SubCategory deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
