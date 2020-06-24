const express = require('express');

const auth = require('../../middleware/auth');
const router = express.Router();
const config = require('config');
const {check, validationResult} = require('express-validator');
const AppraisalType = require('../../models/AppraisalType');


//@route POST api/appraisal
//@desc Create A New AppraisalType
//@access Private
router.post('/',
    [
        auth,
        [
            check('appraisal_name', 'Appraisal Type Name Is Required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        // Validate AppraisalType Name
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
    }
);

//@route GET api/appraisal
//@desc  Get All AppraisalType
//@access  Private
router.get(
    '/',
    async (req, res) => {
        try {
            const appraisal_type = await AppraisalType.find();
            await res.json(appraisal_type);

        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    });

//@route PUT api/appraisal/update
//@access Private
//@desc Update AppraisalType Module
router.put('/update/:appraisal_type_id',
    [
        auth,
        [
            check('appraisal_name', 'Appraisal Name Is Required').not().isEmpty(),
        ]
    ],
    async (req, res) => {
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

    });

//@route DELETE api/appraisal
//@desc  Delete AppraisalType
//@access  Private
router.delete('/:appraisal_type_id', auth, async (req, res) => {
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
});
module.exports = router;