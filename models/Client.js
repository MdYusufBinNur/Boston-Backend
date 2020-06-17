const mongoose = require('mongoose');
const ClientSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    company_name: {
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
        type: String,
        required: true
    },

    reg_date: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: String
    },
    client_web_url:{
        type: String
    }

});

module.exports = Client = mongoose.model('client',ClientSchema);