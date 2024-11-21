const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, 
});

const uploadImageToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: "Ecommerce", 
        });
        return result;
    } catch (error) {
        throw new Error("Failed to upload image to Cloudinary");
    }
};




module.exports = { uploadImageToCloudinary };
