const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
   property_name : {
       type: String,
       required: true
   },
   property_details: {
       type: String
   },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = Property = mongoose.model('property', PropertySchema);
