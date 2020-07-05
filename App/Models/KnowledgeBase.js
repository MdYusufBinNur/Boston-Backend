const mongoose = require('mongoose');
const KnowledgeBaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    created_at:{
        type: Date,
        default: Date.now
    }
});

module.exports = KnowledgeBase = mongoose.model('knowledge_base', KnowledgeBaseSchema);
