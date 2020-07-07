const mongoose = require('mongoose');
const CMSSchema = new mongoose.Schema({

    page: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'page',
        required: true
    },

    name: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    meta_keywords: {
        type: String,

    },

    meta_description: {
        type: String,
    },

    status: {
        type: Boolean,
        default: true
    },

    content: {
        tye: String
    },

    image: {
        type: String
    }

});

module.exports = CMS = new mongoose.model('cms', CMSSchema);
