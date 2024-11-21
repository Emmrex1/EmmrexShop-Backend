const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,  
    },
    description: {
        type: String,
        required: true,
    },
    images: [
    {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(v),
            message: "Invalid image URL",
        },
    },
],

    brand: {
    type: String,
    required: false, 
},
    price: {
        type: Number,
        default: 0,
        min: 0,  
    },
    oldPrice: {
        type: Number,
        default: 0,
        min: 0,  
    },
    category: {  
        type: String,  
        required: true,  
        index: true,  
    },
    countInStock: {  
        type: Number,
        required: true,
        min: 0,  
    },
    rating: {  
        type: Number,
        default: 0,
        min: 0,  
        max: 5,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

  module.exports = mongoose.model('Product', productSchema);
