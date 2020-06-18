const mongoose = require('mongoose');

const SliderSchema = new mongoose.Schema({
    slider_title: {
        type: String
    },
    slider_details: {
        type: String,
    },
    slider_image: {
        type: String,
        required: true
    }
});

module.exports = Slider = mongoose.model('slider', SliderSchema);