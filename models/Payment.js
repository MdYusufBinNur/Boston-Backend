const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({

    invoice: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'invoice',
        required: true
    },

    status: {
        type: String,
        default: 'Y'
    },

    payment_type:{
      type: String
    },

    cheque_no:{
      type: String
    },

    amount:{
      type: String
    },

    memo: {
        type: String
    },

    date: {
        type: Date,
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
});
module.exports = Payment = mongoose.model('payment', PaymentSchema);
