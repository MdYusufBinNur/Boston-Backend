const mongoose = require('mongoose');
const QuickBookSchema = new mongoose.Schema({
    invoice_id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true
    },

    order_no: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'Y'
    },

    client_order: {
        type: String,
        required: true
    },

    date: {
        type: Date,
    },

    address: {
        type: String, //Here address is basically appraisal type
    }
});
module.exports = QuickBook = mongoose.model('quick_book', QuickBookSchema);
