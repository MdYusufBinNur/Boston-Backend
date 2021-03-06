const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const Controller = require('../../App/Http/Controllers/InvoiceController');
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
 * @route api/invoice
 * @method POST
 */
router.post('/', auth, upload.any(), validator.check_invoice, Controller.create);

/**
 * @access private
 * @description Get All Info
 * @route api/invoice/
 * @method GET
 */
router.get('/',auth, Controller.get);

/**
 * @access private
 * @description Get All Deleted Info
 * @route api/invoice/deleted_invoices
 * @method GET
 */
router.get('/deleted_invoices',auth, Controller.deleted_invoice);

/**
 * @access private
 * @description Get Item By Id
 * @route api/invoice/deleted_invoices
 * @method GET
 */
router.get('/:invoice_id',auth, Controller.invoice_by_id);

/**
 * @type {Router}
 * @access private
 * @description Update an Item
 * @route api/invoice/update/:item_id
 * @method PUT
 *
 */
router.put('/update/:invoice_id', auth, upload.any(), Controller.update);

/**
 * @type {Router}
 * @access private
 * @description Delete an Item
 * @route api/invoice/delete/:item_id
 * @method PUT
 *
 */
router.delete('/:invoice_id', auth, Controller.delete);

module.exports = router;

/*

const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Invoice = require('../../App/Models/Invoice');
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
//Save an Invoice
//Access Private
router.post('/', [auth, [
            check('client', 'Please Select A Client').not().isEmpty(),
            check('order', 'Please Select An Order').not().isEmpty(),
            check('address_one', 'Address is required').not().isEmpty(),
            check('city', 'City is required').not().isEmpty(),
            check('state', ' State is required').not().isEmpty(),
            check('zip_code', ' Zip Code is required').not().isEmpty(),
            check('phone', 'Phone Number is required').not().isEmpty(),
            check('description', 'Property city is required').not().isEmpty(),
            check('price', 'Price is required').not().isEmpty(), // Here Amount is declared as Price
            check('total_amount', 'Total Amount is required').not().isEmpty(),
            check('appraisal_fee', 'Appraisal Fee is required').not().isEmpty(), // Here Rate is declared as Appraisal Fee
        ], upload.any(),], async (req, res) => {
        const errors = validationResult(req.body);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }
        //return res.send(req.body.client)
        const {
            client,
            client_order,
            order,
            order_no,
            address_one,
            address_two,
            city,
            state,
            zip_code,
            phone,
            description,
            price,
            total_amount,
            appraisal_fee,
            isDeleted

        } = req.body;
        try {

            const invoiceFields = {};
            let invoiceId = generate_invoice();
            if (await Invoice.findOne({invoice_id: invoiceId})) {
                invoiceId = generate_invoice();
            }

            if (client) invoiceFields.client = client;
            invoiceFields.invoice_id = invoiceId;
            if (order) invoiceFields.order = order;
            if (client_order) invoiceFields.client_order = client_order;
            if (order_no) invoiceFields.order_no = order_no;
            if (city) invoiceFields.city = city;
            if (address_one) invoiceFields.address_one = address_one;
            if (address_two) invoiceFields.address_two = address_two;
            if (state) invoiceFields.state = state;
            if (zip_code) invoiceFields.zip_code = zip_code;
            if (phone) invoiceFields.phone = phone;
            if (isDeleted) invoiceFields.isDeleted = isDeleted;

            if (description) {
                invoiceFields.description = description.split(',').map(description => description.trim());
            }
            if (price) {
                invoiceFields.price = price.split(',').map(price => price.trim());
            }  //Appraisal Price

            if (appraisal_fee) {
                invoiceFields.appraisal_fee = appraisal_fee.split(',').map(appraisal_fee => appraisal_fee.trim());
            }
            if (total_amount) invoiceFields.total_amount = total_amount;
            let invoice = new Invoice(invoiceFields);
            if (await invoice.save()) {
                return res.status(200).json({msg: "New Invoice has been created successfully"});
            }
            return res.status(500).json({error: "Server Error !!!"});
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    });

function generate_invoice() {
    return "INV" + Math.floor(1000 + Math.random() * 9000) + new Date().getFullYear().toString()
        + new Date().getMilliseconds().toString();
}

//Get All Invoice
//Access Private
router.get('/', auth, async (req, res) => {
    try {
        const invoices = await Invoice.find(
            {
                isDeleted: false
            })
            .populate('client');
        return await res.json(invoices);

    } catch (e) {
        console.error(e.message);
        return res.status(500).send("Server Error")
    }
});

//Get All Deleted Invoice
//Access Private
router.get('/deleted', auth, async (req, res) => {
    try {
        if (req.user.type !== 'Admin') {
            return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
        }
        const invoices = await Invoice.find({isDeleted: true})
            .populate('client');
        return await res.json(invoices);

    } catch (e) {
        console.error(e.message);
        return res.status(500).send("Server Error")
    }
});


//Get All Deleted Invoice
//Access Private
router.get('/deleted_all', auth, async (req, res) => {
    try {
        const invoices = await Invoice.find({isDeleted: true})
            .populate('client');
        return await res.json(invoices);

    } catch (e) {
        console.error(e.message);
        return res.status(500).send("Server Error")
    }
});

//Update Invoice
//Access Private
router.put('/update/:invoiceId', [auth, upload.any()],
    async (req, res) => {
        const {
            address_one,
            address_two,
            city,
            state,
            zip_code,
            phone,
            description,
            price,
            total_amount,
            appraisal_fee,
            isDeleted

        } = req.body;
        try {
            const invoiceFields = {};
            if (city)
                invoiceFields.city = city;
            if (address_one)
                invoiceFields.address_one = address_one;
            if (address_two)
                invoiceFields.address_two = address_two;
            if (state)
                invoiceFields.state = state;
            if (isDeleted)
                invoiceFields.isDeleted = isDeleted;
            if (zip_code)
                invoiceFields.zip_code = zip_code;
            if (phone)
                invoiceFields.phone = phone;
            if (description) {
                invoiceFields.description = description.split(',').map(description => description.trim());
            }
            if (price) {
                invoiceFields.price = price.split(',').map(price => price.trim());
            }  //Appraisal Price
            if (appraisal_fee) {
                invoiceFields.appraisal_fee = appraisal_fee.split(',').map(appraisal_fee => appraisal_fee.trim());
            }
            if (total_amount)
                invoiceFields.total_amount = total_amount;

            //return res.send(invoiceFields)
            await Invoice.findOneAndUpdate(
                {_id: req.params.invoiceId},
                {$set: invoiceFields},
                {new: true}
            );
            return res.status(200).json({msg: "Invoice has been updated successfully"});

        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    });

router.delete('/delete/:invoiceId', auth, async (req, res) => {
    try {
        const invoiceFields = {};
        invoiceFields.isDeleted = true;
        if (await Invoice.findOneAndUpdate({_id: req.params.invoiceId}, {$set: invoiceFields})) {
            return res.json({msg: "Order Deleted Successfully"});
        }
        return res.status(500).json({msg: "Something went wrong !!"})
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error")
    }
});

router.get('/:invoiceId', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.invoiceId
        }).populate('client').populate('order');
        return res.status(200).json(invoice);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error")
    }
});

module.exports = router;
*/
