const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const validator = require('../../App/Validator/validator');
const KBController = require('../../App/Http/Controllers/KnowledgeBaseController');

/**
 * @access private
 * @description Create New
 * @route api/kb
 * @method POST
 */
router.post('/', auth, validator.checkKB, KBController.create);

/**
 * @access private
 * @description Update Info
 * @route api/kb/update/:item_id
 * @method PUT
 */
router.put('/update/:item_id', auth, KBController.update);

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
router.delete('/:item_id', auth, KBController.delete);


module.exports = router;
