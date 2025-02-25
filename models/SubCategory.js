const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
});

subCategorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

subCategorySchema.set('toJSON', { virtuals: true });

exports.SubCategory = mongoose.model('SubCategory', subCategorySchema);
exports.subCategorySchema = subCategorySchema;
