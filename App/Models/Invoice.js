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
    isDeleted: {
        type: Boolean,
        default: false
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
        type: [Number],
        required: true
    },
    price: {
        type: [Number],
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    due_amount:{
        type: [String],
        default: 0
    },
    invoice_status:{
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

module.exports = Invoice = mongoose.model('invoice', InvoiceSchema);
