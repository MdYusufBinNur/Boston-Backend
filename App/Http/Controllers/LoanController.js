const {validationResult} = require('express-validator');
const LoanType = require('../../Models/LoanType');

module.exports = {
    create: async function(req, res){
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
    },

    update : async function(req, res) {
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
    },

    get : async function (req, res) {
        try {
            const loan_type = await LoanType.find();
            await res.json(loan_type);

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
            if (await LoanType.findOneAndRemove({_id: req.params.loan_type_id})){
                await res.json({msg: "LoanType Name Deleted Successfully"});
            }
            return res.status(500).json({ msg: "Something went wrong !!"})
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    }
};
