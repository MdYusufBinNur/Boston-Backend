const {validationResult} = require('express-validator');
const QuickBook = require('../../Models/QuickBook');

module.exports = {
    create: async (req, res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {
            invoice,
            order_no,
            status,
            client_order,
            date,
            address,
        } = req.body;

        try {
            //Check if this one if exist already

            const checkQB = QuickBook.findOne({order_no});
            if (checkQB)
            {
                return res.json({msg: "This invoice is already added to the QuickBook"})
            }

            const QBFields = {};
            if (invoice) QBFields.invoice = invoice;
            if (order_no) QBFields.order_no = order_no;
            if (status) QBFields.status = status;
            if (client_order) QBFields.client_order = client_order;
            if (address) QBFields.address = address;
            if (date) QBFields.date = date;
            let quickBook = new QuickBook(QBFields);
            if (quickBook.save()){
                return "Added To QuickBook"
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    get : async function (req, res) {
        try {
            const quick_book = await QuickBook.find({isDeleted: false});
            await res.json(quick_book);
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
            if (await QuickBook.findOneAndRemove({_id: req.params.qb_id})){
                return await res.json({msg: "QuickBook Deleted Successfully"});
            }
            return res.status(500).json({ msg: "Something went wrong !!"})
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    },

    deleted_qb: async (req, res) => {
        try {
            const quick_book = await QuickBook.find({isDeleted: true});
            await res.json(quick_book);
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    },

    quick_book_by_id : async  (req, res) => {
        try {
            const quick_book = await QuickBook.findOne({isDeleted: false, _id: req.params.qb_id});
            await res.json(quick_book);
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    },

    make_soft_delete : async (req, res) => {
        try {
            let QBFields = {};
            QBFields.isDeleted = true;
            if (await QuickBook.findOneAndUpdate({_id: req.params.qb_id},{$set: QBFields})){
                return await res.json({msg: "QuickBook Marked As Deleted Successfully"});
            }
            return res.status(500).json({ msg: "Something went wrong !!"})
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    },
};
