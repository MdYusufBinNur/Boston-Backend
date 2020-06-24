const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({

    order_no: {
        type: String,
        default: "BAS----",
        unique: true
    },

    order_status: {
        type: String,
        default: "on_hold"
    },
    client: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'client'
    },


    lender_or_bank_name: {
        type: String,
        required: true
    },

    lender_street: {
        type: String,
        required: true
    },

    lender_city: {
        type: String,
        required: true
    },

    lender_state: {
        type: String,
        required: true
    },

    lender_zip_code: {
        type: String,
        required: true
    },

    property_street: {
        type: String,
        required: true
    },

    property_city: {
        type: String,
        required: true
    },

    property_state: {
        type: String,
        required: true
    },

    property_zip_code: {
        type: String,
        required: true
    },

    property_country: {
        type: String,
        required: true
    },

    property_on_map: {
        type: Boolean,
        default: true
    },

    borrower_name: {
        type: String,
        required: true
    },

    co_borrower_name: {
        type: String,
    },

    borrower_phone: {
        type: [String],
        required: true
    },

    borrower_email: {
        type: String,
        required: true
    },

    contact_person_name: {
        type: String,
    },

    contact_person_phone: {
        type: [String],
    },

    contact_person_email: {
        type: String,
    },

    appraisal_type: {
        type: [mongoose.Schema.Types.ObjectID],
        ref: 'appraisal_type'
    },

    price: {
        type: String,
        required: true
    },

    loan: {
        type: String
    },

    client_order: {
        type: String,
        required: true,
        unique: true
    },

    loan_type: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "loan_type",
        required: true
    },

    appraisal_fee: {
        type: String
    },

    appraisar_name: {
        type: String,
        required: true
    },

    due_date: {
        type: Date,
    },
    inspection_date: {
        type: Date,
    },
    last_call_date: {
        type: Date,
    },
    created_at: {
        type: Date,
        default: Date.now
    },

    order_form: {
        type: String,
        required: true
    },

    note: {
        type: String
    },
    order_generated_by:{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user'
    }

});
module.exports = Order = mongoose.model('order', OrderSchema);
