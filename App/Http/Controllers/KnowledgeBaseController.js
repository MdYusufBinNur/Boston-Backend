const {validationResult} = require('express-validator');
const KB = require('../../Models/KnowledgeBase');


module.exports = {
    create: async function(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }

        const {
            category,
            title,
            description
        } = req.body;

        try{
            const KB_Fields = {};

            if (category) KB_Fields.category = category;
            if (title) KB_Fields.title = title;
            if (description) KB_Fields.description = description;
            if (req.file) KB_Fields.file = req.file.path;

            let KBC = new KB(KB_Fields);

            if (await KBC.save()){
                return res.status(200).json({ msg: "New Knowledge Base Saved"})
            }

            return res.status(500).json({ msg: "Server Error"});

        }catch (e) {

            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },

    update : async function(req, res) {
        const {
            category,
            title,
            description,
            isDeleted
        } = req.body;

        try{
            const KB_Fields = {};

            if (category) KB_Fields.category = category;
            if (title) KB_Fields.title = title;
            if (description) KB_Fields.description = description;
            if (isDeleted) KB_Fields.isDeleted = isDeleted;
            if (req.file) KB_Fields.file = req.file.path;

            if (await KB.findOneAndUpdate(
                {_id: req.params.kb_id},
                {$set: KB_Fields},
                {new: true}
            )){
                return res.status(200).json({ msg: "New Knowledge Base Updated"})
            }

            return res.status(500).json({ msg: "Server Error"});

        }catch (e) {

            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },

    get : async function (req, res, next) {
        try {
            let All_KB = await KB.find({isDeleted: false}).populate('category');
            if (All_KB){
                return res.status(200).json(All_KB)
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
            if (await KB.findOneAndDelete({_id: req.params.kb_id})){
                return res.status(200).json({ msg: "Deleted"})
            }
            return res.status(500).json({msg: "Server Error"})
        }catch (e) {
            return res.status(500).json({msg: "Server Error"})
        }
    }
};
