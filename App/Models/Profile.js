const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "user"
    },
    company: {
        type: String
    },
    contact: {
        type: String
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zip_code: {
        type: String
    },
    phones: {
        type: [String],
        required: true
    },
    cell_no: {
        type: String
    },
    fax_no: {
        type: [String]
    },
    username: {
        type: String
    },
    reg_date: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
