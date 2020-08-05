const {validationResult} = require('express-validator');
const Invoice = require('../../Models/Invoice');

module.exports = {
    create: async function (req, res) {
        const errors = validationResult(req.body);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }
        //return res.send(req.body.client)
        const {
            client,
            client_order,
            order,
            order_no,
            address_one,
            address_two,
            city,
            state,
            zip_code,
            phone,
            description,
            price,
            total_amount,
            appraisal_fee,
            isDeleted

        } = req.body;
        try {

            const invoiceFields = {};
            let invoiceId = generate_invoice();
            if (await Invoice.findOne({invoice_id: invoiceId})) {
                invoiceId = generate_invoice();
            }

            if (client) invoiceFields.client = client;
            invoiceFields.invoice_id = invoiceId;
            if (order) invoiceFields.order = order;
            if (client_order) invoiceFields.client_order = client_order;
            if (order_no) invoiceFields.order_no = order_no;
            if (city) invoiceFields.city = city;
            if (address_one) invoiceFields.address_one = address_one;
            if (address_two) invoiceFields.address_two = address_two;
            if (state) invoiceFields.state = state;
            if (zip_code) invoiceFields.zip_code = zip_code;
            if (phone) invoiceFields.phone = phone;
            if (isDeleted) invoiceFields.isDeleted = isDeleted;

            if (description) {
                invoiceFields.description = description.split(',').map(description => description.trim());
            }
            if (price) {
                invoiceFields.price = price.split(',').map(price => price.trim());
            }  //Appraisal Price

            if (appraisal_fee) {
                invoiceFields.appraisal_fee = appraisal_fee.split(',').map(appraisal_fee => appraisal_fee.trim());
            }
            if (total_amount) invoiceFields.total_amount = total_amount;
            let invoice = new Invoice(invoiceFields);
            if (await invoice.save()) {
                return res.status(200).json({msg: "New Invoice has been created successfully"});
            }
            return res.status(500).json({error: "Server Error !!!"});
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    },

    update: async function (req, res) {
        const {
            address_one,
            address_two,
            city,
            state,
            zip_code,
            phone,
            description,
            price,
            total_amount,
            appraisal_fee,
            isDeleted,
            order
        } = req.body;
        try {
            const invoiceFields = {};
            if (city)
                invoiceFields.city = city;
            if (address_one)
                invoiceFields.address_one = address_one;
            if (address_two)
                invoiceFields.address_two = address_two;
            if (state)
                invoiceFields.state = state;
            if (isDeleted)
                invoiceFields.isDeleted = isDeleted;
            if (zip_code)
                invoiceFields.zip_code = zip_code;
            if (phone)
                invoiceFields.phone = phone;
            if (description) {
                invoiceFields.description = description.split(',').map(description => description.trim());
            }
            if (price) {
                invoiceFields.price = price.split(',').map(price => price.trim());
            }  //Appraisal Price
            if (appraisal_fee) {
                invoiceFields.appraisal_fee = appraisal_fee.split(',').map(appraisal_fee => appraisal_fee.trim());
            }
            if (total_amount)
                invoiceFields.total_amount = total_amount;

            //return res.send(invoiceFields)
            if (order) {
                await Invoice.findOneAndUpdate(
                    {order: order},
                    {$set: invoiceFields},
                    {new: true})
            }
            await Invoice.findOneAndUpdate(
                {_id: req.params.invoice_id},
                {$set: invoiceFields},
                {new: true}
            );
            return res.status(200).json({msg: "Invoice has been updated successfully"});

        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    },

    get: async function (req, res) {
        try {
            const invoices = await Invoice.find(
                {
                    isDeleted: false
                })
                .populate('client');
            return await res.json(invoices);

        } catch (e) {
            console.error(e.message);
            return res.status(500).send("Server Error")
        }
    },

    delete: async function (req, res) {
        try {
            if (req.user.type !== 'Admin') {
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }

            if (await Invoice.findOneAndRemove({_id: req.params.invoice_id})) {
                return await res.json({msg: "Invoice Deleted Successfully"});
            }

            return res.status(500).json({msg: "Server Error"})
        } catch (e) {

            console.error(e.message);

            return res.status(500).json({msg: "Server Error"})
        }
    },

    deleted_invoice: async function (req, res) {
        try {
            if (req.user.type !== 'Admin') {
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }
            const invoices = await Invoice.find({isDeleted: true})
                .populate('client');
            return await res.json(invoices);

        } catch (e) {
            console.error(e.message);
            return res.status(500).send("Server Error")
        }
    },

    invoice_by_id: async function (req, res) {
        try {
            const invoice = await Invoice.findOne({
                _id: req.params.invoice_id
            }).populate('client').populate('order');
            return res.status(200).json(invoice);
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    }
};


function generate_invoice() {
    return "INV" + Math.floor(1000 + Math.random() * 9000) + new Date().getFullYear().toString()
        + new Date().getMilliseconds().toString();
}
