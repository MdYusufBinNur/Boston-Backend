const Invoice = require('../../../App/Models/Invoice');

module.exports = {

    get : async function (req, res) {
        try {
            const invoice = await Invoice.find({isDeleted: false}).populate('client').populate('order');
            return res.status(200).json(invoice);
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    },

    delete : async function(req, res) {

    },
    single_billing: async function(req, res){
        try {
            const invoices = await Invoice.find(
                {
                    isDeleted: false,
                    _id: req.params.billing_id
                })
                .populate('client');
            return await res.json(invoices);

        } catch (e) {
            console.error(e.message);
            return res.status(500).send("Server Error")
        }
    },
    filter: async function(req, res){
        let client_id = req.body.client_id;
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        let key = req.body.key;
        try {
            //return res.send("all");
            if (client_id && start_date && end_date) {
                const order = await Invoice.find({
                    created_at: {
                        $gte: new Date(start_date),
                        $lt: new Date(end_date)
                    },
                    client: client_id
                }).populate('client');

                return await res.json(order);
            }
            if (client_id) {
                const order = await Invoice.find({client: client_id}).populate('client');
                return await res.json(order);
            }
            if (start_date && end_date) {
                const order = await Invoice.find({
                    created_at: {
                        $gte: new Date(start_date),
                        $lt: new Date(end_date)
                    }
                }).populate('client');

                return await res.json(order);
            }

            // if (key) {
            //     let invoices = {};
            //     invoices = await Invoice.find({
            //         $or:
            //             [
            //                 {
            //                     client_order: key
            //                 },
            //                 {
            //                     order_no: key
            //                 }
            //             ]
            //     }).populate(['client']);
            //
            //     return invoices;
            // }

        } catch (e) {
            console.error(e.message);
            return res.status(500).send("Server Error")
        }
    }
};
