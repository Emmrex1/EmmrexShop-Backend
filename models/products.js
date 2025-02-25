const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
    imagePublicIds: [
        {
            type: String, 
        },
    ],
    imagePaths: [
        {
            type: String, 
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
        validate: {
            validator: function (value) {
                return value >= this.price;
            },
            message: 'Old price should not be less than the current price.',
        },
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
        validate: {
            validator: function (value) {
                return value <= 100;
            },
            message: 'Discount cannot be more than 100%',
        },
    },
    size: [
    {
        type: String, 
    },
],
weight: [
    {
        type: String, 
    },
],
ram: [
    {
        type: String, 
    },
],
    category: {
        type: String,
        required: true,
        index: true,
    },
    subCategory: {
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
