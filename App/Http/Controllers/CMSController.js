const {validationResult} = require('express-validator');
const CMS = require('../../Models/CMS');

module.exports = {
    create: async function(req, res){

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }

        const {
            page,
            name,
            title,
            meta_keywords,
            meta_description,
            status,
            content,
            image,
        } = req.body;

        try{
            const CMSFields = {};

            if (page) CMSFields.page = page;
            if (name) CMSFields.name = name;
            if (title) CMSFields.title = title;
            if (meta_keywords) CMSFields.meta_keywords = meta_keywords;
            if (meta_description) CMSFields.meta_description = meta_description;
            if (status) CMSFields.status = status;
            if (content) CMSFields.content = content;
            if (req.file){
                if (req.file.mimetype !== "image/jpeg" || req.file.mimetype !== "image/png")
                {
                    return res.status(401).send({
                        msg: "Please Select valid Image(PNG/JPEG)"
                    })
                }
                CMSFields.image = image;
            }

            //return res.send(req.file);

            let cms = new CMS(CMSFields);

            if (await cms.save()){
                return res.status(200).json({ msg: "New CMS Saved"})
            }

            return res.status(500).json({ msg: "Server Error"});

        }catch (e) {

            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },

    update : async function(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }

        const {
            page,
            name,
            title,
            meta_keywords,
            meta_description,
            status,
            content,
            image,
        } = req.body;

        try{
            const CMSFields = {};

            if (page) CMSFields.page = page;
            if (name) CMSFields.name = name;
            if (title) CMSFields.title = title;
            if (meta_keywords) CMSFields.meta_keywords = meta_keywords;
            if (meta_description) CMSFields.meta_description = meta_description;
            if (status) CMSFields.status = status;
            if (content) CMSFields.content = content;
            if (req.file){
                if (req.file.mimetype !== "image/jpeg" || req.file.mimetype !== "image/png")
                {
                    return res.status(401).send({
                        msg: "Please Select valid Image(PNG/JPEG)"
                    })
                }
                CMSFields.image = image;
            }
            let update_page = await CMS.findOneAndUpdate(
                {_id: req.params.cms_id},
                {$set: CMSFields},
                { new: true});

            if (update_page){
                return res.status(200).json({ msg : "CMS Updated"});
            }

            return res.status(500).json({ msg: "Server Error"});

        }catch (e) {

            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },

    get : async function (req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }

        try{

            let cms = await CMS.find({status: true}).populate('page',['name']);

            if (cms){
                return res.status(200).json(cms);
            }

            return res.status(500).json({ msg: "Server Error"});

        }catch (e) {

            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },
    inactive : async function(req, res) {
        try{

            let cms = await CMS.find({status: false}).populate('page',['name']);

            if (cms){
                return res.status(200).json(cms);
            }

            return res.status(500).json({ msg: "Server Error"});

        }catch (e) {

            console.log(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },

    delete : async function(req, res) {
        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }

            if (await CMS.findOneAndRemove({_id: req.params.cms_id})){
                return await res.json({msg: "CMS Deleted Successfully"});
            }

            return res.status(500).json({ msg: "Server Error"})
        } catch (e) {

            console.error(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    }
};
