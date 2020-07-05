const {validationResult} = require('express-validator');
const KB = require('../../Models/KBCategory');

module.exports = {
    create: async function(req, res){

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }

        const {
            name
        } = req.body;

        try{
            const KBC_Fields = {};

            if (name) KBC_Fields.name = name;

            let check_existence = await KB.findOne({ name: name});

            if (check_existence){
                return res.status(200).json({ msg : "Category Already Exist"});
            }

            let KBC = new KB(KBC_Fields);

            if (await KBC.save()){
                return res.status(200).json({ msg: "New Category Saved"})
            }

            return res.status(500).json({ msg: "Server Error"});

        }catch (e) {

            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },

    update : async function(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }

        const {
            name,
            isDeleted
        } = req.body;

        try{
            const KBC_Fields = {};

            if (name) KBC_Fields.name = name;

            if (isDeleted) KBC_Fields.isDeleted = isDeleted;

            let check_existence = await KB.findOneAndUpdate(
                {_id: req.params.kb_category_id},
                {$set: KBC_Fields},
                { new: true});

            if (check_existence){
                return res.status(200).json({ msg : "Category Name Updated"});
            }

            return res.status(500).json({ msg: "Server Error"});

        }catch (e) {

            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },

    get : async function (req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }

        try{

            let check_existence = await KB.find({ isDeleted: false});

            if (check_existence){
                return res.status(200).json(check_existence);
            }

            return res.status(500).json({ msg: "Server Error"});

        }catch (e) {

            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },

    delete : async function(req, res) {
        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }

            if (await KB.findOneAndRemove({_id: req.params.kb_category_id})){
                return await res.json({msg: "Category Deleted Successfully"});
            }

            return res.status(500).json({ msg: "Server Error"})
        } catch (e) {

            console.error(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    }
};
