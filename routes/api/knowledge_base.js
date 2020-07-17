const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const validator = require('../../App/Validator/validator');
const KBController = require('../../App/Http/Controllers/KnowledgeBaseController');
let cors = require('cors');
router.use(cors());

/**
 *@description here multer is using for files
 * @type {multer}
 */
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/kb/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getMilliseconds().toString() + new Date().getDay().toString() + new Date().getMinutes().toString()+ file.originalname);
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
 * @route api/kb
 * @method POST
 */
router.post('/', auth, upload.single('file'), validator.check_kb, KBController.create);

/**
 * @access private
 * @description Update Info
 * @route api/kb/update/:item_id
 * @method PUT
 */
router.put('/update/:kb_id', auth, upload.single('file'), KBController.update);

/**
 * @access private
 * @description Get All Info
 * @route api/kb/
 * @method GET
 */
router.get('/',auth, KBController.get);

/**
 * @type {Router}
 * @access private
 * @description Delete an Item
 * @route api/kb/delete/:item_id
 * @method DELETE
 *
 */
router.delete('/:kb_id', auth, KBController.delete);


module.exports = router;
