const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const Controller = require('../../App/Http/Controllers/BillingController');

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
 * @route api/billing
 * @method POST
 */
router.post('/filter', auth, upload.any(), Controller.filter);

/**
 * @access private
 * @description Get All Info
 * @route api/billing/
 * @method GET
 */
router.get('/',auth, Controller.get);

/**
 * @type {Router}
 * @access private
 * @description Get an Item
 * @route api/billing/delete/:item_id
 * @method GET
 *
 */
router.get('/:billing_id', auth, Controller.single_billing);

module.exports = router;
