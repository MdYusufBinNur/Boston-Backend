const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const Controller = require('../../App/Http/Controllers/PropertyController');
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
 * @route api/property
 * @method POST
 */
router.post('/', auth, upload.any(), validator.check_property, Controller.create);

/**
 * @access private
 * @description Update Info
 * @route api/property/update/:item_id
 * @method PUT
 */
router.put('/update/:property_id', auth,upload.any(), Controller.update);

/**
 * @access private
 * @description Get All Info
 * @route api/property/
 * @method GET
 */
router.get('/', Controller.get);

/**
 * @type {Router}
 * @access private
 * @description Delete an Item
 * @route api/property/:item_id
 * @method DELETE
 *
 */
router.delete('/:property_id', auth,Controller.delete);


module.exports = router;

/*

const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const config = require('config');
const {check, validationResult} = require('express-validator');
const Property = require('../../App/Models/Property');


//@route POST api/property
//@desc Create A New Property
//@access Private
router.post('/',
    [
        auth,
        [
            check('property_name', 'Property Name Is Required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        // Validate Property Name
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }
        const {
            property_name,
            property_details
        } = req.body;

        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }
            // Check if Property Name Is Already Exist
            let property = await Property.findOne({property_name});
            if (property) {
                return res.status(401).json({errors: [{msg: "Property Name Already Exist !!!"}]})
            }

            // Save Property In DB
            const propertyFields = {}
            if (property_name) propertyFields.property_name = property_name;
            if (property_details) propertyFields.property_details = property_details;

            property = new Property(propertyFields);
            if (await property.save()) {
                return res.status(200).json({msg: 'New Property Added Successfully'});
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//@route GET api/property
//@desc  Get All Property
//@access  Private
router.get(
    '/',
    async (req, res) => {
        try {
            const property = await Property.find();
            await res.json(property);

        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    });

//@route PUT api/property/update
//@access Private
//@desc Update Property Module
router.put('/update/:property_id',
    [
        auth,
        [
            check('property_name', 'Property Name Is Required').not().isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const {
            property_name,
            property_details
        } = req.body;

        console.log(req.user.type)
        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }
            const propertyFields = {};
            if (property_name) propertyFields.property_name = property_name;
            if (property_details) propertyFields.property_details = property_details;

            if (await Property.findOneAndUpdate({_id : req.params.property_id},{$set: propertyFields}, {new : true})){
                return res.status(200).json({ msg : 'Property Name Updated'});
            }
            return res.status(500).json({errors : { msg: 'Something went wrong !!!'}})


        }catch (e) {
            console.log(e.message);
            res.status(500).send('Server Error');
        }

});

//@route DELETE api/property
//@desc  Delete Property
//@access  Private
router.delete('/:property_id', auth, async (req, res) => {
    try {
        if (req.user.type !== 'Admin'){
            return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
        }
        if (await Property.findOneAndRemove({_id: req.params.property_id})){
            await res.json({msg: "Property Name Deleted Successfully"});
        }
        return res.status(500).json({ msg: "Something went wrong !!"})
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error")
    }
});
module.exports = router;
*/
