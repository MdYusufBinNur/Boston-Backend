const {validationResult} = require('express-validator');
const Message = require('../../Models/Message');
const Profile = require('../../Models/Profile');

module.exports = {
    create: async function(req, res){
        const errors = validationResult(req.body);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }
        const {
            sender,
            receiver,
            message_text,
        } = req.body;

        try{
            const messageFields = {};
            if (req.user.id){
                messageFields.sender = req.user.id;
            }
            if (req.user.profileId){
                messageFields.sender_profile = req.user.profileId;
            }
            /* Have to save profile ID in receiver and sender so that we can get user info easily*/
            if (receiver) messageFields.receiver = receiver;
            if (receiver)
            {
                const receiver_profile = await Profile.findOne({user: receiver});
                if (receiver_profile){
                    messageFields.receiver_profile = receiver_profile.id;
                }
            }
            if (message_text) messageFields.message_text = message_text;

            if (req.file) messageFields.message_file = req.file.path;

            //return res.send(req.user);
            let message = new Message(messageFields);
            //return res.send(messageFields);
            if (await message.save()) {
                return res.status(200).json({msg: 'Message Has Been Sent Successfully'});
            }
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    },

    get : async function (req, res) {
        try{
            if (req.user.id){
                const message = await Message.find({sender: req.user.id}).select('-sender').select('-receiver')
                    .populate({
                        path: 'sender_profile',
                        select: ['user','username','first_name','last_name'],
                        populate: {
                            path: 'user',
                            select: ['user_type','email']
                        }
                    })
                    .populate({
                        path: 'receiver_profile',
                        select: ['user','username','first_name','last_name'],
                        populate: {
                            path: 'user',
                            select: ['user_type','email']
                        }
                    });
                return await res.json(message);
            }
        }catch (e) {
            console.log(e.message);
            return res.status(500).send(e.message);
        }
    },

    message_by_user_id : async function(req, res) {
        try{
            if (req.user.id){
                const message = await Message.find({sender: req.user.id, receiver: req.params.receiver_id}).populate(['sender','receiver'])
                return await res.json(message);
            }
        }catch (e) {
            console.log(e.message);
            return res.status(500).send(e.message);
        }
    }
};
