const mongoose = require('mongoose');
const { Category } = require('./Category');

const productSchema = mongoose.Schema ({
     name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    images: [
        {
            type: String,
            required: true,
        }
    ],

    brand: {
        type: String,
        required: true,
    },
    
    
    price: {
        type: Number,
        default: 0,
    },
    
    Category: {
      
        type: mongoose.Schema.Types. ObjectId,
        ref: 'Category',
        require: true,
    },

    CountInStock: {
        type: Number,
        required: true,
    },

    Rating: {
        type: Number,
        default: 0,
    },

    numReviews: {
        type: Number,
        default: 0,
    },

    isFeatured:{
      type: Boolean,
      default: false,
    },

    dateCreated:{
        type: Date,
        default: Date.now,
    },

})

exports.product = mongoose.model('Product', productSchema);