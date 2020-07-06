const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const validator = require('../../App/Validator/validator');
const Controller = require('../../App/Http/Controllers/NoteForClientController');

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
 * @route api/note_for_client
 * @method POST
 */
router.post('/', auth, upload.any(), validator.check_client_note, Controller.create);

/**
 * @access private
 * @description Update Info
 * @route api/note_for_client/update/:item_id
 * @method PUT
 */
router.put('/update/:note_id', auth,upload.any(), Controller.update);

/**
 * @access private
 * @description Get All Info
 * @route api/note_for_client/
 * @method GET
 */
router.get('/',auth, Controller.get);

/**
 * @type {Router}
 * @access private
 * @description Delete an Item
 * @route api/note_for_client/delete/:item_id
 * @method DELETE
 *
 */
router.delete('/:note_id', auth, Controller.delete);

/**
 * @type {Router}
 * @access private
 * @description Get Client, Client Invoice to show in front
 * @route api/note_for_client/list
 * @method DELETE
 *
 */
router.get('/list', auth, Controller.list);

module.exports = router;
