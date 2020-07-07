const {validationResult} = require('express-validator');
const Page = require('../../Models/Page');

module.exports = {
    create: async function(req, res){

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }

        const {
            name
        } = req.body;

        try{
            const PageFields = {};

            if (name) PageFields.name = name;

            let check_existence = await Page.findOne({ name: name});

            if (check_existence){
                return res.status(200).json({ msg : "Page Name Already Exist"});
            }

            let page = new Page(PageFields);

            if (await page.save()){
                return res.status(200).json({ msg: "New Page Saved"})
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
            name,
            isDeleted
        } = req.body;

        try{
            const PageFields = {};

            if (name) PageFields.name = name;

            if (isDeleted) PageFields.isDeleted = isDeleted;

            let update_page = await Page.findOneAndUpdate(
                {_id: req.params.page_id},
                {$set: PageFields},
                { new: true});

            if (update_page){
                return res.status(200).json({ msg : "Page Name Updated"});
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

            let pages = await Page.find({ isDeleted: false});

            if (pages){
                return res.status(200).json(pages);
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

            if (await Page.findOneAndRemove({_id: req.params.page_id})){
                return await res.json({msg: "Page Deleted Successfully"});
            }

            return res.status(500).json({ msg: "Server Error"})
        } catch (e) {

            console.error(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    }
};
