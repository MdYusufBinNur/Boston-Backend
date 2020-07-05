const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Invoice = require('../../models/Invoice');
const Payment = require('../../models/Payment');
const Qb = require('../../models/QuickBook');
const helper = require('../../controller/helper');
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
router.post(
    '/',
    [
        auth,
        upload.any(),
        [
            check('invoice', 'Please Select A Invoice').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {
            invoice,
            cheque_no,
            memo,
            amount,
            date
        } = req.body;

        try {
            let paymentsFields = {};
            if (invoice) paymentsFields.invoice = invoice;
            if (cheque_no) paymentsFields.cheque_no = cheque_no;
            if (memo) paymentsFields.memo = memo;
            if (amount) paymentsFields.memo = amount;
            if (date) paymentsFields.memo = date;
            let payment = new Payment(paymentsFields);
            if (await payment.save()) {

                let invoices  = await Invoice.findOne({_id: invoice});

                let qq =  await Qb.findOne({order_no : invoices.order_no});

                if (!qq)
                {
                    let QbData = {};
                    QbData.invoice = invoice;
                    QbData.order_no = invoices.order_no;
                    QbData.client_order = invoices.client_order;
                    QbData.date = invoices.created_at;
                    QbData.address = invoices.address_one + ',' + invoices.state + ',' + ',' +invoices.zip_code + ',' + invoices.city;
                    let QB = helper.sync_to_qb(QbData);
                    return res.json({msg: "Naw Payment Saved, " + QB})
                }
                return res.json({msg: "Naw Payment Saved"})


            }
            return res.status(500).json('Something went wrong!! Try Again.');
        }

        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

router.get(
    '/', auth,
    async (req, res) => {
        try {
            const payments = await Payment.find({isDeleted: false}).populate('invoice');
            await res.json(payments);

        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    });

router.put(
    '/update/:payment_id',
    auth,
    upload.any(),
    async (req, res) => {
        const {
            invoice,
            cheque_no,
            memo,
            amount,
            date,
            isDeleted
        } = req.body;

        try {
            let paymentsFields = {};
            if (invoice) paymentsFields.invoice = invoice;
            if (cheque_no) paymentsFields.cheque_no = cheque_no;
            if (memo) paymentsFields.memo = memo;
            if (amount) paymentsFields.memo = amount;
            if (date) paymentsFields.memo = date;
            if (isDeleted) paymentsFields.isDeleted = isDeleted;
            if (await Payment.findOneAndUpdate({_id: req.params.payment_id}, {$set: paymentsFields},{ new: true})) {
                return res.json({msg:"Payment Updated"})
            }
            return res.status(500).json('Something went wrong!! Try Again.');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

router.post(
    '/payments_under_specific_cheque',
    auth,
    upload.any(),
    [
        check('cheque_no', 'Please Input Cheque Number').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        try {
            let cheque_no = req.body.cheque_no;
            let results = await Payment.find(
                {
                    isDeleted: false,
                    cheque_no: cheque_no
                }
            ).populate(
                {
                    path: 'invoice',
                    populate: {
                       path: 'client'
                    }
                }
            ).populate(
                {
                    path: 'invoice',
                    populate: {
                        path: 'order'
                    }
                }
            );
            if (results){
                return res.status(200).json({results});
            }
        } catch (e) {
            res.status(500).send('Server Error');
        }
    });

router.delete('/delete/:payment_id', auth, async (req, res)=> {
    try{
        if (req.user.type !== 'Admin'){
            return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
        }
        let paymentFields = {};
        paymentFields.isDeleted = true;
        if (await Payment.findOneAndUpdate({_id: req.params.payment_id},{$set: paymentFields})) {
            return await res.json({msg: "Payment Deleted Successfully"});
        }
        return res.status(500).json({ msg: "Something went wrong !!"})
    }
    catch (e) {
        console.log(e.message);
        return res.status(500).send('Sever Error');
    }
});

module.exports = router;
