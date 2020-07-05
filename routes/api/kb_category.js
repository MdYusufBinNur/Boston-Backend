const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const validator = require('../../App/Validator/validator');
const KBController = require('../../App/Http/Controllers/KBCategoryController');

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
 * @route api/kb_category
 * @method POST
 */
router.post('/', auth, upload.any(), validator.check_kb_category, KBController.create);

/**
 * @access private
 * @description Update Info
 * @route api/kb_category/update/:item_id
 * @method PUT
 */
router.put('/update/:kb_category_id', auth,upload.any(), KBController.update);

/**
 * @access private
 * @description Get All Info
 * @route api/kb_category/
 * @method GET
 */
router.get('/',auth, KBController.get);

/**
 * @type {Router}
 * @access private
 * @description Delete an Item
 * @route api/kb_category/delete/:item_id
 * @method DELETE
 *
 */
router.delete('/:kb_category_id', auth, KBController.delete);


module.exports = router;
