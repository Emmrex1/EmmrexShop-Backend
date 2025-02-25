const multer = require('multer'); 
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fs = require('fs');
        if (!fs.existsSync('uploads/')) {
            fs.mkdirSync('uploads/');
        }
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const isImage = filetypes.test(file.mimetype) && filetypes.test(path.extname(file.originalname).toLowerCase());
        if (isImage) {
            return cb(null, true); 
        } else {
            return cb(new Error('Only image files are allowed!'), false);
        }
    }
});

module.exports = upload;
