const mongoose = require('mongoose');
const AppraisalSchema = new mongoose.Schema({
   appraisal_name: {
       type: String,
       required: true
   },

    appraisal_fee: {
       type: String
    },

    appraisal_details:{
       type: String
    }
});
module.exports = AppraisalType = mongoose.model('appraisal_type', AppraisalSchema);