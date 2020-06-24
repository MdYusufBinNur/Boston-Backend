const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    client:{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'client',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'order',
        required: true
    },

    invoice_id:{
        type: String,
        required: true,
        unique: true
    },

    order_no: {
        type: String,
        required: true
    },

    client_order:{
        type: String,
        required: true,
    },
    address_one: {
        type: String,
        required: true,
    },
    address_two: {
        type: String
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip_code:{
        type: String,
        required: true,
    },
    phone: {
        type: [String],
        required: true,
    },
    invoice_date: {
        type: Date,
        default: Date.now()
    },

    description:{
        type: [String]
    },
    appraisal_fee: {
        type: [String],
        required: true
    },
    price: {
        type: [String],
        required: true
    },
    total_amount: {
        type: String,
        required: true
    },
    due_amount:{
        type: [String],
        default: 0
    }
});

module.exports = Invoice = mongoose.model('invoice', InvoiceSchema);
