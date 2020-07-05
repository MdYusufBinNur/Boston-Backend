const mongoose = require('mongoose');

const KBCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = KBCategory = mongoose.model('kb_category', KBCategorySchema);
