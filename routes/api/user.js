const express = require('express');

const auth = require('../../middleware/auth');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const {check, validationResult} = require('express-validator');
//Import models
const User = require('../../models/User');
const Profile = require('../../models/Profile');
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

            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(payload,
                config.get('jwtSecret'),
                {expiresIn: 360000},
                (err, token) => {
                    if (err) throw err;
                    res.json({token})
                });


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
    '/myprofile',
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
            const profile = await Profile.find().populate('user', ['email', 'avatar', 'active','user_type']);
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
            username
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

            if (user_type) userFields.user_type = user_type;
            //See if user already exist
            let user = await User.findOne({_id: req.params.user_id});
            let profileUpdate = await Profile.findOne({user: req.params.user_id});


            if (user && profileUpdate) {

                user = await User.findOneAndUpdate({_id: req.params.user_id},
                    {$set: userFields},
                    {new: true})
                profileUpdate = await Profile.findOneAndUpdate(
                    {user: req.params.user_id},
                    {$set: profileFields},
                    {new: true}
                );

                return res.json(profileUpdate)
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