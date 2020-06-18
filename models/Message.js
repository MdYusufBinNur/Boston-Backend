const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user',
        required: true
    },
    message_text:{
        type: String
    },
    message_file:{
        type: String

    }
});

module.exports = Message = mongoose.model('message',MessageSchema);