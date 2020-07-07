const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();

const Controller = require('../../App/Http/Controllers/SliderController');
const validator = require('../../App/Validator/validator');


/**
 *@description here multer is using for files
 * @type {multer}
 */
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/sliders/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getMilliseconds().toString() + new Date().getDay().toString() + new Date().getMinutes().toString()+ file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


/**
 * @access private
 * @description Create New
 * @route api/slider
 * @method POST
 */
router.post('/', auth, upload.single('slider_image'), validator.check_slider, Controller.create);

/**
 * @access private
 * @description Update Info
 * @route api/slider/update/:item_id
 * @method PUT
 */
router.put('/update/:slider_id', auth, upload.single('slider_image'), Controller.update);

/**
 * @access private
 * @description Get All Info
 * @route api/slider/
 * @method GET
 */
router.get('/',auth, Controller.get);

/**
 * @type {Router}
 * @access private
 * @description Delete an Item
 * @route api/slider/delete/:item_id
 * @method DELETE
 *
 */
router.delete('/:slider_id', auth,Controller.delete);


module.exports = router;
