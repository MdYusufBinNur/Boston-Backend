const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    user_type:{
        type: String,
        default: "user"
    },
    active: {
        type: Boolean,
        default: true
    },
    avatar:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = User = mongoose.model('user', UserSchema);
