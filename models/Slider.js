const mongoose = require('mongoose');

const SliderSchema = new mongoose.Schema({
    slider_title: {
        type: String
    },
    slider_details: {
        type: String,
    },
    slider_position: {
      type: String,
    },
    slider_image: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = Slider = mongoose.model('slider', SliderSchema);
