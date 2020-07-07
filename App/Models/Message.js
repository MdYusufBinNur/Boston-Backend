const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user',
        required: true
    },
    sender_profile: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'profile',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user',
        required: true
    },
    receiver_profile: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'profile',
        required: true
    },
    message_text:{
        type: String
    },
    message_file:{
        type: String

    },
    time: {
        type: Date,
        default: Date.now()
    }
});

module.exports = Message = mongoose.model('message',MessageSchema);