const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const Controller = require('../../App/Http/Controllers/QuickBookController');
const validator = require('../../App/Validator/validator');

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
 * @route api/qb
 * @method POST
 */
router.post('/', auth, upload.any(), validator.check_qb, Controller.create);

/**
 * @access private
 * @description Get Active Records
 * @route api/qb
 * @method GET
 */
router.get('/', auth,  Controller.get);


/**
 * @access private
 * @description Get Inactive Records
 * @route api/qb/deleted_qb
 * @method GET
 */
router.get('/deleted_qb', auth, Controller.deleted_qb);

/**
 * @access private
 * @description Get Records By ID
 * @route api/qb/:qb_no
 * @method GET
 */
router.get('/:qb_id', auth, Controller.quick_book_by_id);

/**
 * @access private
 * @description Delete Records
 * @route api/qb/:qb_no
 * @method DELETE
 */
router.delete('/:qb_id', auth, Controller.delete);

/**
 * @access private
 * @description Soft Delete Records
 * @route api/qb/:qb_no
 * @method DELETE
 */
router.delete('/delete/:qb_id', auth, Controller.make_soft_delete);

module.exports = router;
/*


const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const multer = require('multer');
const QuickBook = require('../../App/Models/QuickBook');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getMilliseconds().toString() + new Date().getDay().toString() + new Date().getMinutes().toString()+ file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    cb(null, true);
};
const upload = multer({
    storage: storage
});

const cors = require('cors');
router.use(cors());
router.post(
    '/',
    [
        auth,
        upload.any(),
        [
            check('invoice', 'Invoice Is Required').not().isEmpty(),
            check('order_no', 'Order No Is Required').not().isEmpty(),
            check('client_order', 'Client Order No Is Required').not().isEmpty(),
        ],

    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {
            invoice,
            order_no,
            status,
            client_order,
            date,
            address,
        } = req.body;

        try {
            //Check if this one if exist already

            const checkQB = QuickBook.findOne({order_no});
            if (checkQB)
            {
                return res.json({msg: "This invoice is already added to the QuickBook"})
            }

            const QBFields = {};
            if (invoice) QBFields.invoice = invoice;
            if (order_no) QBFields.order_no = order_no;
            if (status) QBFields.status = status;
            if (client_order) QBFields.client_order = client_order;
            if (address) QBFields.address = address;
            if (date) QBFields.date = date;
            let quickBook = new QuickBook(QBFields);
            if (quickBook.save()){
                return "Added To QuickBook"
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

//@route GET api/quick_book
//@desc  Get All Active QB
//@access  Private
router.get(
    '/', auth,
    async (req, res) => {
        try {
            const quick_book = await QuickBook.find({isDeleted: false});
            await res.json(quick_book);
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    });

//@route GET api/quick_book
//@desc  Get All Deleted QB
//@access  Private
router.get(
    '/deleted_qb', auth,
    async (req, res) => {
        try {
            const quick_book = await QuickBook.find({isDeleted: true});
            await res.json(quick_book);
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    });

//@route GET api/quick_book/{id}
//@desc  Get Single QB Details
//@access  Private
router.get(
    '/:qb_no', auth,
    async (req, res) => {
        try {
            const quick_book = await QuickBook.findOne({isDeleted: false, _id: req.params.qb_no});
            await res.json(quick_book);
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    });

//@route DELETE api/quick_book
//@desc  Delete QB
//@access  Private
router.delete('/delete/:qb_id', auth, upload.any(), async (req, res) => {
    try {
        let QBFields = {};
        QBFields.isDeleted = true;
        if (await QuickBook.findOneAndUpdate({_id: req.params.qb_id},{$set: QBFields})){
            return await res.json({msg: "QuickBook Marked As Deleted Successfully"});
        }
        return res.status(500).json({ msg: "Something went wrong !!"})
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error")
    }
});

//@route DELETE api/quick_book
//@desc  Delete QB
//@access  Private
router.delete('/:qb_id', auth, upload.any(), async (req, res) => {
    try {
        if (req.user.type !== 'Admin'){
            return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
        }
        if (await QuickBook.findOneAndRemove({_id: req.params.qb_id})){
            return await res.json({msg: "QuickBook Deleted Successfully"});
        }
        return res.status(500).json({ msg: "Something went wrong !!"})
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error")
    }
});
module.exports = router;
*/
