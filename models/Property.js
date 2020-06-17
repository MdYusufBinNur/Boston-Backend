const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
   property_name : {
       type: String,
       required: true
   },
   property_details: {
       type: String
   }
});

module.exports = Property = mongoose.model('property', PropertySchema);