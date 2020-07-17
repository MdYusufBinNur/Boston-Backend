const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const validator = require('../../App/Validator/validator');
const Controller = require('../../App/Http/Controllers/PageController');

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
 * @route api/page
 * @method POST
 */
router.post('/', auth, upload.any(), validator.check_page, Controller.create);

/**
 * @access private
 * @description Update Info
 * @route api/page/update/:item_id
 * @method PUT
 */
router.put('/update/:page_id', auth,upload.any(), Controller.update);

/**
 * @access private
 * @description Get All Info
 * @route api/page/
 * @method GET
 */
router.get('/',auth, Controller.get);

/**
 * @type {Router}
 * @access private
 * @description Delete an Item
 * @route api/page/delete/:item_id
 * @method DELETE
 *
 */
router.delete('/:page_id', auth, Controller.delete);


module.exports = router;
