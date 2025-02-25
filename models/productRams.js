const mongoose = require('mongoose');

const productRamsSchema = mongoose.Schema({
    name: {
        type: String,
        default: null,
    },
});

productRamsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productRamsSchema.set('toJSON', { virtuals: true });
const ProductRams = mongoose.model('ProductRams', productRamsSchema);

module.exports = ProductRams; 
