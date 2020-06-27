const mongoose = require('mongoose');
const AppraisalSchema = new mongoose.Schema({
   appraisal_name: {
       type: String,
       required: true
   },

    appraisal_price: {
       type: String
    },

    appraisal_details:{
       type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
module.exports = AppraisalType = mongoose.model('appraisal_type', AppraisalSchema);
