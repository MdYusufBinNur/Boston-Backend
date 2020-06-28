const express = require('express');

const auth = require('../../middleware/auth');
const router = express.Router();
const config = require('config');
const {check, validationResult} = require('express-validator');
const Slider = require('../../models/Slider');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/sliders/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getMilliseconds().toString() + new Date().getDay().toString() + new Date().getMinutes().toString()+ file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    cb(null, true);
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
//Save a new Slider
router.post('/',
    [
    auth,
        [
            check('slider_image', 'Slider Image is required').not().isEmpty(),
        ],
    upload.single('slider_image')
    ],
    async (req, res) => {
        const errors = validationResult(req.body);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }
        const {
            slider_title,
            slider_details,
            slider_position
        } = req.body;

        try{
            if(!req.file)
            {
                return res.status(500).send("Slider Image Is Required");
            }
            const sliderFields ={};
            if (slider_title) sliderFields.slider_title = slider_title;
            if (slider_details) sliderFields.slider_details = slider_details;
            if (slider_position) sliderFields.slide_position = slider_position;
            sliderFields.slider_image = req.file.path;

            let slider = new Slider(sliderFields);
            if (await slider.save()){
                return res.status(200).json({msg: "New Slider Has Been Added Successfully " });
            }
            return res.status(500).send("Something went wrong!! try Again");

        }
        catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
);
//update Sliders
//Access Private
router.put('/:slider_id', [
    auth,upload.single('slider_image')
],async (req, res) => {
    const {
        slider_title,
        slider_details,
        slider_position,
        isDeleted,
    } = req.body;

    try{
        const sliderFields ={};
        if (slider_title) sliderFields.slider_title = slider_title;
        if (slider_details) sliderFields.slider_details = slider_details;
        if (slider_position) sliderFields.slide_position = slider_position;
        if (isDeleted) sliderFields.isDeleted = isDeleted;
        if (req.file) sliderFields.slider_image = req.file.path;

        if (await Slider.findOneAndUpdate(
            {_id: req.params.slider_id},
            {$set:sliderFields},
            { new: true})){
            return res.status(200).json({msg: "New Slider Has Been Updated Successfully " });
        }
        return res.status(500).send("Something went wrong!! try Again");

    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
});

//Get All Sliders
//Access public
router.get(
    '/',
    async (req, res) => {
        try {
            const order = await Slider.find({isDeleted: false});
            return await res.json(order);
        } catch (e) {
            console.error(e.message);
            return res.status(500).send("Server Error")
        }
    });

//@route DELETE api/sliders
//@desc  Delete Sliders
//@access  Private
router.delete('/:slider_id', auth, async (req, res) => {
    try {
        if (req.user.type !== 'Admin'){
            return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
        }
        if (await Slider.findOneAndRemove({_id: req.params.slider_id})){
            return  res.json({msg: "Slider Deleted Successfully"});
        }
        return res.status(500).json({ msg: "Something went wrong !!"})
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error")
    }
});

module.exports = router;
