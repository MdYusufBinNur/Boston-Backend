const express = require('express');

const auth = require('../../middleware/auth');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const {check, validationResult} = require('express-validator');
const multer = require('multer');
const Client = require('../../models/Client');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/client/');
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
    storage: storage

});

//@route POST api/client
//@desc Create A New Client
//@access Private
var cors = require('cors');
router.use(cors());
router.post(
    '/',
    [
        auth,
        upload.any(),
        [
            check('username', 'UserName Is Required').not().isEmpty(),
            check('company_name', 'Company Name Is Required').not().isEmpty(),
            check('contact_name', 'Contact Name Is Required').not().isEmpty(),
            check('address', 'Address Is Required').not().isEmpty(),
            check('city', 'City Is Required').not().isEmpty(),
            check('state', 'State Is Required').not().isEmpty(),
            check('zip_code', 'Zip Code Is Required').not().isEmpty(),
            check('phones', 'Phone Number Is Required').not().isEmpty(),
            check('email', 'Please input a valid email').isEmail(),
            check('password', 'Please enter password with 6 or more character').isLength({min: 6})
        ],

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
            city,
            state,
            zip_code,
            phones,
            cell_no,
            fax_no,
            email,
            password,
            comment,
            username,
            client_web_url,
        } = req.body;

        try {
            //See if client already exist
            let client = await Client.findOne({email});
            if (client) {
                return res.status(400).json({errors: [{msg: 'Client Already Exist With This Email'}]});
            }

            const ClientFields = {};

            //Encrypted password
            const salt = await bcrypt.genSalt(10);
            ClientFields.password = await bcrypt.hash(password, salt);
            if (email) ClientFields.email = email;
            if (username) ClientFields.username = username;
            if (company_name) ClientFields.company_name = company_name;
            if (contact_name) ClientFields.contact_name = contact_name;
            if (first_name) ClientFields.first_name = first_name;
            if (last_name) ClientFields.last_name = last_name;
            if (address) ClientFields.address = address;
            if (city) ClientFields.city = city;
            if (state) ClientFields.state = state;
            if (zip_code) ClientFields.zip_code = zip_code;
            if (phones) {
                ClientFields.phones = phones.split(',').map(phones => phones.trim());
            }
            if (fax_no) {
                ClientFields.fax_no = fax_no.split(',').map(fax_no => fax_no.trim());
            }
            if (cell_no) ClientFields.cell_no = cell_no;
            if (comment) ClientFields.comment = comment;

            if (client_web_url) ClientFields.client_web_url = client_web_url;

            let new_client = new Client(ClientFields);
           if (await new_client.save()){
               return  res.json({msg: "New Client Added Successfully"});
           }
            return  res.status(500).send('Server Error');

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    });

//@route GET api/client
//@desc  Get All Client
//@access  Private
router.get(
    '/', auth,
    async (req, res) => {
        try {
            const client = await Client.find({isDeleted: false});
            await res.json(client);

        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    });

//@route GET api/client/deleted_all
//@desc  Get All Deleted Client
//@access  Private
router.get(
    '/deleted_all', auth,
    async (req, res) => {
        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }
            const client = await Client.find({isDeleted: true});
            await res.json(client);

        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    });

//@route PUT api/client/update
//@access Private
//@desc Update Client Module
router.put('/update/:client_id',
    [
        auth,
        upload.any()
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
            city,
            state,
            zip_code,
            phones,
            cell_no,
            fax_no,
            comment,
            username,
            client_web_url,
            isDeleted
        } = req.body;

        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }

            const ClientFields = {};

            if (username) ClientFields.username = username;
            if (company_name) ClientFields.company_name = company_name;
            if (contact_name) ClientFields.contact_name = contact_name;
            if (first_name) ClientFields.first_name = first_name;
            if (last_name) ClientFields.last_name = last_name;
            if (address) ClientFields.address = address;
            if (city) ClientFields.city = city;
            if (state) ClientFields.state = state;
            if (zip_code) ClientFields.zip_code = zip_code;
            if (phones) {
                ClientFields.phones = phones.split(',').map(phones => phones.trim());
            }
            if (fax_no) {
                ClientFields.fax_no = fax_no.split(',').map(fax_no => fax_no.trim());
            }
            if (cell_no) ClientFields.cell_no = cell_no;
            if (comment) ClientFields.comment = comment;
            if (client_web_url) ClientFields.client_web_url = client_web_url;
            if (isDeleted) ClientFields.isDeleted = isDeleted;


            if (await Client.findOneAndUpdate({_id : req.params.client_id},{$set: ClientFields}, {new : true})){
                return res.status(200).json({ msg : 'Client  Updated'});
            }
            return res.status(500).json({errors : { msg: 'Server Error !!!'}})


        }catch (e) {
            console.log(e.message);
            res.status(500).send('Server Error');
        }

    });

//@route SOFT DELETE api/client/delete
//@desc  Delete Client
//@access  Private
router.delete('/delete/:client_id', auth, upload.any(), async (req, res) => {
    try {
        if (req.user.type !== 'Admin'){
            return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
        }
        let clientFields = {};
        clientFields.isDeleted = true;
        if (await Client.findOneAndUpdate({_id: req.params.client_id},{$set: clientFields})){
            return await res.json({msg: "Client Deleted Successfully"});
        }
        return res.status(500).json({ msg: "Something went wrong !!"})
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error")
    }
});
//@route DELETE api/client
//@desc  Delete Client
//@access  Private
router.delete('/:client_id', auth, upload.any(), async (req, res) => {
    try {
        if (req.user.type !== 'Admin'){
            return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
        }
        if (await Client.findOneAndRemove({_id: req.params.client_id})){
            return await res.json({msg: "Client Deleted Successfully"});
        }
        return res.status(500).json({ msg: "Something went wrong !!"})
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error")
    }
});
module.exports = router;
