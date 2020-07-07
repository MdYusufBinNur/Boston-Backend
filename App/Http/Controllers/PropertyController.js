const {validationResult} = require('express-validator');
const Property = require('../../Models/Property');

module.exports = {
    create: async (req, res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }
        const {
            property_name,
            property_details
        } = req.body;

        try {
            // Check if Property Name Is Already Exist
            let property = await Property.findOne({property_name});
            if (property) {
                return res.status(401).json({errors: [{msg: "Property Name Already Exist !!!"}]})
            }

            // Save Property In DB
            const propertyFields = {};
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
    },

    update : async (req, res) => {
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
    },

    get : async function (req, res) {
        try {
            const property = await Property.find();
            await res.json(property);

        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    },

    delete : async (req, res) => {
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
    }
};
