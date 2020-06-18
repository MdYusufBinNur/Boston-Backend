const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Message = require('../../models/Message');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/message_files/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getMilliseconds().toString() + new Date().getDay().toString() + new Date().getMinutes().toString()+ file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    cb(null, true);
    // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    //     cb(null, true);
    // } else {
    //     cb(null, false);
    // }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

/*
    @Route api/message [POST METHOD]
    @Desc Save a message
    @Access Private
*/


router.post('/',
    [
        auth,
        upload.single('message_file'),
        [
            check('receiver', 'Receiver is required')
        ]
    ],
    async (req, res) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        return res.status(401).json({errors: errors.array()});
    }
    const {
        sender,
        receiver,
        message_text,
        message_file
    } = req.body;

    try{
        const messageFields = {};
        if (req.user.id){
            messageFields.sender = req.user.id;
        }
        if (receiver) messageFields.receiver = receiver;
        if (message_text) messageFields.message_text = message_text;
        messageFields.message_file = req.file.path;

        let message = new Message(messageFields);
        //return res.send(messageFields);
        if (await message.save()) {
            return res.status(200).json({msg: 'Message Has Been Sent Successfully'});
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }

});
router.get('/',auth, async (req, res) => {
    try{
        if (req.user.id){
            const message = await Message.find({sender: req.user.id}).populate(['sender','receiver'])
            return await res.json(message);
        }
    }catch (e) {
        console.log(e.message);
        return res.status(500).send(e.message);
    }
});

router.get('/:receiver_id',auth, async (req, res) => {
    try{
        if (req.user.id){
            const message = await Message.find({sender: req.user.id, receiver: req.params.receiver_id}).populate(['sender','receiver'])
            return await res.json(message);
        }
    }catch (e) {
        console.log(e.message);
        return res.status(500).send(e.message);
    }
});
module.exports = router;