const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const validator = require('../../App/Validator/validator');
const Controller = require('../../App/Http/Controllers/Auth/AuthController');
var cors = require('cors');
router.use(cors());

/**
 * @description Get Auth User Data
 * @api api/auth
 * @method GET
 * @access Private
 */
router.get('/',auth, Controller.get);

/**
 * @description Login
 * @api api/auth
 * @method POST
 * @access Private
 */
router.post('/', validator.check_login, Controller.login);


module.exports = router;
