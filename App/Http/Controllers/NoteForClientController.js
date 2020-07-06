const {validationResult} = require('express-validator');
const ClientNote = require('../../Models/NoteForClient');
const Invoice = require('../../../models/Invoice');

module.exports = {
    create: async function(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }

        const {
            client,
            details,
            status_ryan,
            status_as_on_is,
            callback_date,
            last_spoken_not_called,
            created_at
        } = req.body;

        try{
            const NoteFields = {};

            if (client) NoteFields.client = client;
            if (details) NoteFields.details = details;
            if (status_ryan) NoteFields.status_ryan = status_ryan;
            if (status_as_on_is) NoteFields.status_as_on_is = status_as_on_is;
            if (callback_date) NoteFields.status_as_on_is = callback_date;
            if (last_spoken_not_called) NoteFields.last_spoken_not_called = last_spoken_not_called;
            if (created_at) NoteFields.created_at = created_at;

            let clientNote = new ClientNote(NoteFields);

            if (await clientNote.save()){
                return res.status(200).json({ msg: "New Note Saved"})
            }

            return res.status(500).json({ msg: "Server Error"});

        }catch (e) {

            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },

    update : async function(req, res) {
        const {
            client,
            details,
            status_ryan,
            status_as_on_is,
            callback_date,
            last_spoken_not_called,
            created_at,
            isDeleted
        } = req.body;
        try{
            const NoteFields = {};

            if (client) NoteFields.client = client;
            if (details) NoteFields.details = details;
            if (status_ryan) NoteFields.status_ryan = status_ryan;
            if (status_as_on_is) NoteFields.status_as_on_is = status_as_on_is;
            if (callback_date) NoteFields.status_as_on_is = callback_date;
            if (last_spoken_not_called) NoteFields.last_spoken_not_called = last_spoken_not_called;
            if (created_at) NoteFields.created_at = created_at;
            if (isDeleted) NoteFields.isDeleted = isDeleted;

            if (await ClientNote.findOneAndUpdate(
                {_id: req.params.note_id},
                {$set: NoteFields},
                {new: true}
            )){
                return res.status(200).json({ msg: "Client Note Updated"})
            }

            return res.status(500).json({ msg: "Server Error"});

        }catch (e) {

            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },

    get : async function (req, res, next) {
        try {
            let clients = await ClientNote.find({isDeleted: false}).populate('client');
            if (clients){
                return res.status(200).json(clients)
            }
            return res.status(500).json({msg: "Server Error"})
        }catch (e) {
            return res.status(500).json({msg: "Server Error"})
        }
    },

    delete : async function(req, res) {
        try {
            if (req.user.type !== "Admin")
            {
                return res.status(404).json({ msg: "Access Denied"})
            }
            if (await ClientNote.findOneAndDelete({_id: req.params.note_id}))
            {
                return res.status(200).json({ msg: "Deleted"})
            }
            return res.status(500).json({msg: "Server Error"})
        }catch (e) {
            return res.status(500).json({msg: "Server Error"})
        }
    },

    list: async function(req, res) {
        try {
            let client_list = await Invoice.find({isDeleted: false})
                .select('client')
                .select('total_amount');

            /**
             * Making Group By with single column name client
             */

           const hash = client_list.reduce((p,c) => (p[c.client] ? p[c.client].push(c) : p[c.client] = [c],p) ,{}),
                newData = Object.keys(hash).map(k => ({client: k, list: hash[k]}));

           let sum = client_list.map(o => parseInt(o.total_amount)).reduce((a, c) => { return a + c });
           return res.status(200).json(hash);
        }catch (e) {
            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    }
};
