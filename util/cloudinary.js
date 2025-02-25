const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadImage = async (filePath, folder = 'Ecommerce') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    console.log("Uploaded Image URL:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

const uploadImageToCloudinary = (filePath) => {
  return cloudinary.uploader.upload(filePath, { folder: "Ecommerce" });
};

module.exports = { uploadImage, uploadImageToCloudinary };



