const mongoose = require('mongoose');
const PageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Page = new mongoose.model('page',PageSchema);
