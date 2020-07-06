const mongoose = require('mongoose');
const KnowledgeBaseSchema = new mongoose.Schema({
    category:{
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: 'kb_category'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    file:{
      type: String
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
