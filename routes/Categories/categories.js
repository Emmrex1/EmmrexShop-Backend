const express = require("express");
const { Category } = require("../../models/Category");
const { SubCategory } = require("../../models/SubCategory");
const upload = require("../../middleware/multer");
const { uploadImage } = require("../../util/cloudinary");
const mongoose = require("mongoose");
const router = express.Router();

router.post('/create', upload.array('images', 5), async (req, res) => {
  try {
    const { name, color } = req.body;
    const images = req.files;

    if (!name || !color || !images || images.length === 0) {
      return res.status(400).json({ error: 'All fields, including images, are required.' });
    }

    const uploadedImages = await Promise.all(
      images.map(image => uploadImage(image.path))
    );

    const category = await Category.create({
      name,
      color,
      images: uploadedImages,
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error('Category creation failed:', error);
    res.status(500).json({ error: 'Failed to create category.' });
  }
});

router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList.length) {
      return res.status(404).json({ success: false, message: "No categories found." });
    }
    res.status(200).json({ success: true, categories: categoryList });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Category by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: "Invalid ID format." });
  }

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, error: "Category not found." });
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("Error fetching category by ID:", error.message);
    res.status(500).json({ success: false, error: "Server error. Failed to fetch category." });
  }
});

// Update Category
router.put("/:id", upload.array("newImages", 5), async (req, res) => {
  try {
    const { name, color } = req.body;
    const files = req.files;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    if (files && files.length > 0) {
      const uploadedImages = await Promise.all(
        files.map((file) => uploadImage(file.path))
      );
      category.images = uploadedImages;
    }

    category.name = name || category.name;
    category.color = color || category.color;

    await category.save();

    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Category and its SubCategories
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    await SubCategory.deleteMany({ category: req.params.id });
    res.status(200).json({ success: true, message: "Category and its subcategories deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
