const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const Controller = require('../../App/Http/Controllers/LoanController');
const validator = require('../../App/Validator/validator');

let cors = require('cors');
router.use(cors());

/**
 *@description here multer is using for files
 * @type {multer}
 */
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getMilliseconds().toString() + new Date().getDay().toString() + new Date().getMinutes().toString() + file.originalname);
    }
});
const upload = multer({
    storage: storage,
});

/**
 * @access private
 * @description Create New
 * @route api/loan_type
 * @method POST
 */
router.post('/', auth, upload.any(), validator.check_loan, Controller.create);

/**
 * @access private
 * @description Update Info
 * @route api/loan_type/update/:item_id
 * @method PUT
 */
router.put('/update/:loan_type_id', auth, upload.any(), Controller.update);

/**
 * @access private
 * @description Get All Info
 * @route api/loan_type/
 * @method GET
 */
router.get('/',auth, Controller.get);

/**
 * @type {Router}
 * @access private
 * @description Delete an Item
 * @route api/loan_type/:item_id
 * @method DELETE
 *
 */
router.delete('/:loan_type_id', auth,Controller.delete);


module.exports = router;


/*
const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const LoanType = require('../../App/Models/LoanType');


//@route POST api/loan
//@desc Create A New LoanType
//@access Private
router.post('/',
    [
        auth,
        [
            check('loan_type_name', 'Loan Type Name Is Required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        // Validate LoanType Name
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }
        const {
            loan_type_name,
            loan_type_details
        } = req.body;

        let loan_type;
        try {
            if (req.user.type !== 'Admin') {
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }
            // Check if LoanType Name Is Already Exist
            let loan_type = await LoanType.findOne({loan_type_name});
            if (loan_type) {
                return res.status(401).json({errors: [{msg: "Loan Type Name Already Exist !!!"}]})
            }

            // Save LoanType In DB
            const loanTypeFields = {};
            if (loan_type_name) loanTypeFields.loan_type_name = loan_type_name;
            if (loan_type_details) loanTypeFields.loan_type_details = loan_type_details;

            loan_type = new LoanType(loanTypeFields);
            if (await loan_type.save()) {
                return res.status(200).json({msg: 'New Loan Type Added Successfully'});
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//@route GET api/loan
//@desc  Get All LoanType
//@access  Private
router.get(
    '/',
    async (req, res) => {
        try {
            const loan_type = await LoanType.find();
            await res.json(loan_type);

        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    });

//@route PUT api/loan/update
//@access Private
//@desc Update LoanType Module
router.put('/update/:loan_type_id',
    [
        auth,
        [
            check('loan_type_name', 'LoanType Name Is Required').not().isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const {
            loan_type_name,
            loan_type_details
        } = req.body;

        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }
            const loanTypeFields = {};
            if (loan_type_name) loanTypeFields.loan_type_name = loan_type_name;
            if (loan_type_details) loanTypeFields.loan_type_details = loan_type_details;

            if (await LoanType.findOneAndUpdate({_id : req.params.loan_type_id},{$set: loanTypeFields}, {new : true})){
                return res.status(200).json({ msg : 'LoanType Name Updated'});
            }
            return res.status(500).json({errors : { msg: 'Something went wrong !!!'}})


        }catch (e) {
            console.log(e.message);
            res.status(500).send('Server Error');
        }

    });

//@route DELETE api/loan
//@desc  Delete LoanType
//@access  Private
router.delete('/:loan_type_id', auth, async (req, res) => {
    try {
        if (req.user.type !== 'Admin'){
            return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
        }
        if (await LoanType.findOneAndRemove({_id: req.params.loan_type_id})){
            await res.json({msg: "LoanType Name Deleted Successfully"});
        }
        return res.status(500).json({ msg: "Something went wrong !!"})
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error")
    }
});
module.exports = router;
*/
