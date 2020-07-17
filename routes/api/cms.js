const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const validator = require('../../App/Validator/validator');
const Controller = require('../../App/Http/Controllers/CMSController');

let cors = require('cors');
router.use(cors());
/**
 *@description here multer is using for handling files
 * @type {multer}
 */
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/cms');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getMilliseconds().toString() + new Date().getDay().toString() + new Date().getMinutes().toString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    cb(null, true);
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


/**
 * @access private
 * @description Create New
 * @route api/cms
 * @method POST
 */
router.post('/', auth, upload.single('image'), validator.check_cms, Controller.create);

/**
 * @access private
 * @description Update Info
 * @route api/cms/update/:item_id
 * @method PUT
 */
router.put('/update/:cms_id', auth,upload.any(), Controller.update);

/**
 * @access private
 * @description Get All Active Info
 * @route api/cms/
 * @method GET
 */
router.get('/',auth, Controller.get);

/**
 * @access private
 * @description Get All Inactive Info
 * @route api/cms/inactive
 * @method GET
 */
router.get('/inactive',auth, Controller.inactive);

/**
 * @type {Router}
 * @access private
 * @description Delete an Item
 * @route api/cms/delete/:item_id
 * @method DELETE
 *
 */
router.delete('/:cms_id', auth, Controller.delete);


module.exports = router;
