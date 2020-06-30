const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Order = require('../../models/Order');
const Client = require('../../models/Client');
const Invoice = require('../../models/Invoice');
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

//Get All Billing Result
//@Api /api/billing
//Access Private
router.get('/', auth, async (req, res) => {
    try {
        const invoice = await Invoice.find({isDeleted: false}).populate('client').populate('order');
        return res.status(200).json(invoice);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error")
    }
});

//Get Single Billing Result
//@Api /api/billing/billing_id Here Billing Id is basically invoice id
//Access Private
router.get('/:billing_id', auth, async (req, res) => {
    // return await res.json(req.params.billing_id);

    try {
        const invoices = await Invoice.find(
            {
                isDeleted: false,
                _id: req.params.billing_id
            })
            .populate('client');
        return await res.json(invoices);

    } catch (e) {
        console.error(e.message);
        return res.status(500).send("Server Error")
    }
});

// @route POST api/billing/filter
// Access Private
router.post('/filter', auth, upload.any(), async (req, res) => {
    //return res.send(req.body.client_id);
    let client_id = req.body.client_id;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;
    let key = req.body.key;
    try {
        //return res.send("all");
        if (client_id && start_date && end_date) {
            const order = await Invoice.find({
                created_at: {
                    $gte: new Date(start_date),
                    $lt: new Date(end_date)
                },
                client: client_id
            }).populate('client');

            return await res.json(order);
        }
        if (client_id) {
            const order = await Invoice.find({client: client_id}).populate('client');
            return await res.json(order);
        }
        if (start_date && end_date) {
            const order = await Invoice.find({
                created_at: {
                    $gte: new Date(start_date),
                    $lt: new Date(end_date)
                }
            }).populate('client');

            return await res.json(order);
        }

        // if (key) {
        //     let invoices = {};
        //     invoices = await Invoice.find({
        //         $or:
        //             [
        //                 {
        //                     client_order: key
        //                 },
        //                 {
        //                     order_no: key
        //                 }
        //             ]
        //     }).populate(['client']);
        //
        //     return invoices;
        // }

    } catch (e) {
        console.error(e.message);
        return res.status(500).send("Server Error")
    }
});

router.post('/add_to_qb', [auth, upload.any()], (res, req) => {

});

module.exports = router;
