const mongoose = require('mongoose');

const NoteForClientSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'client',
        required: true
    },

    details: {
        type: String
    },
    status_ryan: {
        type: String
    },
    status_as_on_is: {
        type: String
    },

    created_at: {
        type: Date,
        default: Date.now
    },

   callback_date: {
        type: Date,
    },

   last_spoken_not_called: {
        type: Date,
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = NoteForClient = mongoose.model('note_for_client', NoteForClientSchema);
