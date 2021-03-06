const mongoose = require('mongoose');
const LoanTypeSchema = new mongoose.Schema({
   loan_type_name: {
       type: String,
       required: true
   },

    loan_type_details:{
       type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
module.exports = LoanType = mongoose.model('loan_type', LoanTypeSchema);
