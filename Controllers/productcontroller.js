const products = require("../models/products");
const Product = require('../models/products');
const { uploadImageToCloudinary } = require("../util/cloudinary");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const handleError = (res, err, message = 'An error occurred') => {
    console.error(message, err);
    return res.status(500).json({ success: false, error: message, details: err.message });
};

async function createProduct(req, res) {
 try {
        const {
            name, description, category, subCategory, brand,
            price, oldPrice, discount,
        } = req.body;

        
        const sizes = req.body.sizes || [];  
        const weights = req.body.weights || [];
        const rams = req.body.rams || [];


        const isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
        const countInStock = parseInt(req.body.countInStock, 10) || 0;
        const rating = parseFloat(req.body.rating) || 0;

        let finalPrice = price;
        if (discount) {
            if (discount > 0 && discount <= 100) {
                finalPrice = price - (price * (discount / 100));
            } else {
                return res.status(400).json({ success: false, error: 'Invalid discount value.' });
            }
        }

        if (oldPrice && oldPrice < price) {
            return res.status(400).json({ success: false, error: 'Old price should not be less than the current price.' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'No images uploaded.' });
        }

        const uploadPromises = req.files.map(file => uploadImageToCloudinary(file.path));
        const uploadResults = await Promise.all(uploadPromises);

        const imgUrls = uploadResults.map(item => item.secure_url);
        const publicIds = uploadResults.map(item => item.public_id);
        const localPaths = req.files.map(file => file.path);

        const newProduct = new Product({
            name,
            description,
            images: imgUrls,
            imagePublicIds: publicIds,
            imagePaths: localPaths,
            brand,
            price: finalPrice,
            oldPrice,
            discount,
            size: sizes,
            weight: weights,
            ram: rams,
            category,
            subCategory,
            countInStock,
            rating,
            isFeatured,
        });

        const savedProduct = await newProduct.save();

        res.status(200).json({
            success: true,
            message: 'Product created successfully',
            product: savedProduct,
        });
    } catch (err) {
        handleError(res, err, 'Error creating product.');
    }
}

async function getAllProducts(req, res) {
try {
        const page = parseInt(req.query.page, 10) || 1;
        const perPage = Math.min(parseInt(req.query.perPage, 10) || 50, 100);

        const { category, subCategory, brand } = req.query; 

        const filter = {};

        if (category) {
            filter.category = category; 
        }

        if (subCategory) {
            filter.subCategory = subCategory;
        }

        if (brand) {
            filter.brand = brand;
        }

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / perPage);

        if (page > totalPages) {
            return res.status(200).json({
                success: true,
                products: [],
                pagination: { totalProducts, totalPages, currentPage: page, perPage },
            });
        }

        const productList = await Product.find(filter)
            .populate('category subCategory weight ram size')  
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            success: true,
            products: productList,
            pagination: { totalProducts, totalPages, currentPage: page, perPage },
        });
    } catch (err) {
        handleError(res, err, 'Error fetching products.');
    }

}

async function getFeaturedProducts(req, res) {
    try {
        const featuredProducts = await Product.find({ isFeatured: true })
            .populate("category subCategory")
            .limit(20) 
            .sort({ createdAt: -1 }); 
        res.status(200).json({ success: true, products: featuredProducts });
    } catch (err) {
        handleError(res, err, "Error fetching featured products.");
    }
}

async function getSingleProducts(req, res) {
 
  try {
          const productId = req.params.id;
  
          if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
              return res.status(400).json({ success: false, message: 'Invalid product ID' });
          }
  
          const product = await Product.findById(productId);
  
          if (!product) {
              return res.status(404).json({ success: false, message: 'Product not found' });
          }
  
          res.status(200).json({ success: true, product });
      } catch (err) {
          handleError(res, err, 'Error fetching product.');
      }
}

const getRelatedProducts = async (req, res) => {
  try {
    const { subCategory } = req.query;

    if (!subCategory) {
      console.log("SubCategory is missing");
      return res.status(400).json({ message: "Subcategory is required." });
    }

    const relatedProducts = await products
      .find({ subCategory })
      .limit(8)
      .select("name price images rating countInStock oldPrice");

    if (!relatedProducts || relatedProducts.length === 0) {
      return res.status(404).json({ message: "No related products found." });
    }

    res.status(200).json({ products: relatedProducts });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: "Error fetching related products." });
  }
};

async function getProductsByCategoryName(req, res) {

  try {
          const { categoryName } = req.params;
          const { subCategoryName, brand } = req.query;
  
          const filter = { category: categoryName };
  
          if (subCategoryName) {
              const subCategory = await Subcategory.findOne({ name: subCategoryName });
  
              if (!subCategory) {
                  return res.status(404).json({ success: false, message: 'Subcategory not found.' });
              }
  
              filter.subCategory = subCategory._id;
          }
  
          if (brand) {
              filter.brand = brand;
          }
  
          // Fetch products based on the filter
          const products = await Product.find(filter);
  
          if (!products || products.length === 0) {
              return res.status(404).json({ success: false, message: 'No products found for this category and subcategory.' });
          }
  
          res.status(200).json({ success: true, products });
      } catch (err) {
          handleError(res, err, 'Error fetching products by category and subcategory.');
      }
  
}

async function updateProduct(req, res) {
  try {
        const { name, description, category, subCategory, brand, price, oldPrice, countInStock, rating, isFeatured } = req.body;

         const sizes = req.body.sizes || [];  
        const weights = req.body.weights || [];
        const rams = req.body.rams || [];


        let imgUrls = req.body.images || [];
        let publicIds = req.body.imagePublicIds || [];
        let localPaths = req.body.imagePaths || [];

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => uploadImageToCloudinary(file.path));
            const uploadResults = await Promise.all(uploadPromises);

            imgUrls = uploadResults.map(item => item.secure_url);
            publicIds = uploadResults.map(item => item.public_id);
            localPaths = req.files.map(file => file.path);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                images: imgUrls,
                imagePublicIds: publicIds,
                imagePaths: localPaths,
                brand,
                price,
                oldPrice,
                category,
                size: sizes,
                weight: weights,
                ram: rams,
                subCategory,
                countInStock: parseInt(countInStock, 10) || 0,
                rating: parseFloat(rating) || 0,
                isFeatured: isFeatured === 'true' || isFeatured === true,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (err) {
        handleError(res, err, 'Error updating product.');
    }

}

async function deleteProduct(req, res){
  try {
          const product = await Product.findById(req.params.id);
  
          if (!product) {
              return res.status(404).json({ success: false, message: 'Product not found.' });
          }
  
          if (product.imagePublicIds && product.imagePublicIds.length > 0) {
              const deletePromises = product.imagePublicIds.map(publicId => cloudinary.uploader.destroy(publicId));
              await Promise.all(deletePromises);
          }
  
          await Product.findByIdAndDelete(req.params.id);
  
          res.status(200).json({ success: true, message: 'Product deleted successfully.' });
      } catch (err) {
          handleError(res, err, 'Error deleting product.');
      }

}

// async function deleteProduct(req, res) {
//   const { productId } = req.params;

//   if (!checkPermission(req.user.role, 'admin')) {
//     return res.status(403).send('Permission denied');
//   }

//   // Simulate product deletion
//   deleteProductFromDatabase(productId); 
//   sendEmailNotification(
//     'Product Deleted',
//     `A product with ID: ${productId} was deleted by ${req.user.name}.`
//   );
//   res.status(200).send('Product deleted');
// }

async function recentlyviewedProduct(req, res) {
    try {
        const { productIds } = req.body;
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ success: false, message: "No product IDs provided." });
        }

        const products = await Product.find({ _id: { $in: productIds } })
            .populate("category subCategory")
            .limit(10); 
        res.status(200).json({ success: true, products });
    } catch (err) {
        handleError(res, err, "Error fetching recently viewed products.");
    }
}




module.exports = { getRelatedProducts,
   getAllProducts,
   getFeaturedProducts,
   getSingleProducts,
   getProductsByCategoryName,
   deleteProduct,
   recentlyviewedProduct,
   createProduct,updateProduct};
