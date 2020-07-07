const {validationResult} = require('express-validator');
const AppraisalType = require('../../Models/AppraisalType');

module.exports = {
    create: async function(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }
        const {
            appraisal_name,
            appraisal_details,
            appraisal_price
        } = req.body;

        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }
            // Check if AppraisalType Name Is Already Exist
            let appraisalType = await AppraisalType.findOne({appraisal_name});
            if (appraisalType) {
                return res.status(401).json({errors: [{msg: "Appraisal Name Already Exist !!!"}]})
            }

            // Save AppraisalType In DB
            const appraisalTypeFields = {}
            if (appraisal_name) appraisalTypeFields.appraisal_name = appraisal_name;
            if (appraisal_details) appraisalTypeFields.appraisal_details = appraisal_details;
            if (appraisal_price) appraisalTypeFields.appraisal_price = appraisal_price;

            appraisal_type = new AppraisalType(appraisalTypeFields);
            if (await appraisal_type.save()) {
                return res.status(200).json({msg: 'New Appraisal Added Successfully'});
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    update : async function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const {
            appraisal_name,
            appraisal_details,
            appraisal_price
        } = req.body;

        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }
            const appraisalTypeFields = {};
            if (appraisal_name) appraisalTypeFields.appraisal_name = appraisal_name;
            if (appraisal_details) appraisalTypeFields.appraisal_details = appraisal_details;
            if (appraisal_price) appraisalTypeFields.appraisal_price = appraisal_price;

            if (await AppraisalType.findOneAndUpdate({_id : req.params.appraisal_type_id},{$set: appraisalTypeFields}, {new : true})){
                return res.status(200).json({ msg : 'Appraisal Name Updated'});
            }
            return res.status(500).json({errors : { msg: 'Something went wrong !!!'}})


        }catch (e) {
            console.log(e.message);
            res.status(500).send('Server Error');
        }
    },

    get : async function (req, res) {
        try {
            const appraisal_type = await AppraisalType.find();
            await res.json(appraisal_type);

        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    },

    delete : async function(req, res) {
        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }
            if (await AppraisalType.findOneAndRemove({_id: req.params.appraisal_type_id})){
                await res.json({msg: "Appraisal Name Deleted Successfully"});
            }
            return res.status(500).json({ msg: "Something went wrong !!"})
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    }
};
