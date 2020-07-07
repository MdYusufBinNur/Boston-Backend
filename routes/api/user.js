const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const validator = require('../../App/Validator/validator');
const Controller = require('../../App/Http/Controllers/UserController');

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
 * @route api/user
 * @method POST
 */
router.post('/', auth, upload.any(), validator.check_user, Controller.create);

/**
 * @access private
 * @description Get All Info
 * @route api/user/
 * @method GET
 */
router.get('/', auth, Controller.get);

/**
 * @access private
 * @description Get All Info
 * @route api/user/myProfile
 * @method GET
 */
router.get('/myProfile', auth, Controller.my_profile);

/**
 * @access private
 * @description Get All Deleted User Info
 * @route api/user/deleted_all
 * @method GET
 */
router.get('/deleted_all', auth, Controller.deleted_user);

/**
 * @access private
 * @description Get Specific User Info
 * @route api/user/:user_id
 * @method GET
 */
router.get('/:user_id', auth, Controller.user_by_id);

/**
 * @access private
 * @description Update Info
 * @route api/client/update/:item_id
 * @method PUT
 */
router.put('/update/:user_id', auth, upload.any(), Controller.update);


/**
 * @type {Router}
 * @access private
 * @description Delete an Item
 * @route api/user/:item_id
 * @method DELETE
 *
 */
router.delete('/:user_id', auth, Controller.delete);

module.exports = router;

/*

const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
//Import models
const User = require('../../App/Models/User');
const Profile = require('../../App/Models/Profile');
//@route Post api/user
//@desc  Register a user route
//@access  Public
var cors = require('cors');
router.use(cors());
router.post(
    '/',
    [
        check('first_name', 'First Name Is Required').not().isEmpty(),
        check('last_name', 'Last Name Is Required').not().isEmpty(),
        check('address', 'Address Is Required').not().isEmpty(),
        check('phones', 'Phone Number Is Required').not().isEmpty(),
        check('email', 'Please input a valid email').isEmail(),
        check('password', 'Please enter password with 6 or more character').isLength({min: 6})
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const {
            company_name,
            contact_name,
            first_name,
            last_name,
            address,
            user_type,
            city,
            state,
            zip_code,
            phones,
            cell_no,
            fax_no,
            email,
            password,
            comment
        } = req.body;

        try {
            //See if user already exist
            let user = await User.findOne({email});
            if (user) {
                return res.status(400).json({errors: [{msg: 'User Already Exist With This Email'}]});
            }

            //Get user gravator
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const username = "@" + first_name + last_name;

            user = user_type ? new User({email, password, user_type, avatar}) : new User({email, password, avatar});

            const profileFields = {};

            //Encrypted password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            //return  res.send(user.id)
            //Save Profile of each Clients or Users
            profileFields.user = user.id.trim();
            profileFields.username = username;
            if (company_name) profileFields.company_name = company_name;
            if (contact_name) profileFields.contact_name = contact_name;
            if (first_name) profileFields.first_name = first_name;
            if (last_name) profileFields.last_name = last_name;
            if (address) profileFields.address = address;
            if (city) profileFields.city = city;
            if (state) profileFields.state = state;
            if (zip_code) profileFields.zip_code = zip_code;
            if (phones) {
                profileFields.phones = phones.split(',').map(phones => phones.trim());
            }
            if (fax_no) {
                profileFields.fax_no = fax_no.split(',').map(fax_no => fax_no.trim());
            }
            if (cell_no) profileFields.cell_no = cell_no;
            if (comment) profileFields.comment = comment;

            let profile = new Profile(profileFields);
            await profile.save();

     /!*       const payload = {
                user: {
                    id: user.id,
                }
            };
            jwt.sign(payload,
                config.get('jwtSecret'),
                {expiresIn: 360000},
                (err, token) => {
                    if (err) throw err;
                    res.json({token})
                });*!/

            return res.status(200).json({msg: "New User Saved Successfully"})
            //Return jsonwebtoken
            //res.send('User Registered')
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    });


//@route GET api/profile/myProfile
//@desc  Get Current user Profile
//@access  private
router.get(
    '/myProfile',
    auth,
    async (req, res) => {
        try {
            const profile = await Profile.findOne({user: req.user.id}).populate('user', ['email', 'avatar', 'active', 'user_type']);
            if (!profile) {
                return res.status(400).json({msg: "There is no profile for this user"})
            }
            //console.log(profile)
            await res.json(profile)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('SERVER ERROR');
        }
    });


//@route GET api/profile
//@desc  Get All Profiles
//@access  Public
router.get(
    '/profiles/',
    async (req, res) => {
        try {
            const profile = await Profile.find({isDeleted: false}).populate('user', ['email', 'avatar', 'active','user_type']);
            await res.json(profile);

        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    });
//@route GET api/profile
//@desc  Get All Profiles
//@access  Public
router.get(
    '/deleted_all',
    async (req, res) => {
        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }
            const profile = await Profile.find({isDeleted: true}).populate('user', ['email', 'avatar', 'active','user_type']);
            await res.json(profile);

        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    });


//@route GET api/user/:user_id
//@desc  Get Single User Profile
//@access  Public
router.get('/:user_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user');
        if (!profile) {
            return res.status(400).json({msg: 'Profile not found'});
        }
        await res.json(profile);

    } catch (e) {
        console.error(e.message);
        if (e.kind === 'ObjectId') {
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send("Server Error")
    }
});


// @route api/user/update
// Access Private
// Desc Update Profile Info

router.put('/update/:user_id',
    [
        auth,
        [
            check('first_name', 'First Name Is Required').not().isEmpty(),
            check('last_name', 'Last Name Is Required').not().isEmpty(),
            check('address', 'Address Is Required').not().isEmpty(),
            check('phones', 'Phone Number Is Required').not().isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()})
        }
        const {
            company_name,
            contact_name,
            first_name,
            last_name,
            address,
            user_type,
            city,
            state,
            zip_code,
            phones,
            cell_no,
            fax_no,
            comment,
            username,
            isDeleted
        } = req.body;

        try {

            const profileFields = {};
            const userFields = {};
            //Save Profile of each Clients or Users

            if (username) profileFields.username = username;
            if (company_name) profileFields.company_name = company_name;
            if (contact_name) profileFields.contact_name = contact_name;
            if (first_name) profileFields.first_name = first_name;
            if (last_name) profileFields.last_name = last_name;
            if (address) profileFields.address = address;
            if (city) profileFields.city = city;
            if (state) profileFields.state = state;
            if (zip_code) profileFields.zip_code = zip_code;
            if (phones) {
                profileFields.phones = phones.split(',').map(phone => phone.trim());
            }
            if (fax_no) {
                profileFields.fax_no = fax_no.split(',').map(fax => fax.trim());
            }
            if (cell_no) profileFields.cell_no = cell_no;
            if (comment) profileFields.comment = comment;
            if (isDeleted) profileFields.isDeleted = isDeleted;

            if (user_type) userFields.user_type = user_type;
            //See if user already exist
            let user = await User.findOne({_id: req.params.user_id});
            let profileUpdate = await Profile.findOne({user: req.params.user_id});


            if (user && profileUpdate) {

                user = await User.findOneAndUpdate({_id: req.params.user_id},
                    {$set: userFields},
                    {new: true});
                profileUpdate = await Profile.findOneAndUpdate(
                    {user: req.params.user_id},
                    {$set: profileFields},
                    {new: true}
                );

                return res.json(await Profile.findOne({user: req.params.user_id}).populate('user'))
            } else {
                res.status(500).send('User is not valid');
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });


//@route DELETE api/profile
//@desc  Delete Profile
//@access  Private
router.delete('/:user_id', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({user: req.params.user_id});
        await User.findOneAndRemove({_id: req.params.user_id});

        await res.json({msg: "User Deleted Successfully"});

    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error")
    }
});


module.exports = router;
*/
