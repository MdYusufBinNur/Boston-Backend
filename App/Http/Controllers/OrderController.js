const {validationResult} = require('express-validator');
const Order = require('../../Models/Order');
const Client = require('../../Models/Client');
const Invoice = require('../../Models/Invoice');
const helper = require('../../Helpers/helper');

module.exports = {
    create: async (req, res) => {
        const errors = validationResult(req.body);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }
        //return res.send(req.body.client)
        const {
            client,
            lender_or_bank_name,
            lender_street,
            lender_city,
            lender_state,
            lender_zip_code,
            property_street,
            property_city,
            property_state,
            property_zip_code,
            property_country,
            property_on_map,
            borrower_name,
            co_borrower_name,
            borrower_phone,
            borrower_email,
            contact_person_name,
            contact_person_phone,
            contact_person_email,
            appraisal_type,
            loan,
            client_order,
            loan_type,
            appraisal_fee,
            appraisar_name,
            due_date,
            order_form,
            note,
            order_status,
            price,
            total_amount

        } = req.body;
        try {

            // Save Order In DB
            const orderFields = {};
            const invoiceFields = {};

            let invoiceId = generate_invoice();
            let newOrderNo = generate_order_no();
            let clientOrderNo = generate_client_order();
            const client_info = await Client.findOne({_id: client});
            if (!client_info)
            {
                return res.send({msg: "No Client Found"});
            }


            if (await Order.findOne({order_no: newOrderNo})){
                newOrderNo = generate_invoice();
            }

            if (await Order.findOne({client_order: clientOrderNo})){
                clientOrderNo = generate_client_order();
            }

            if (await Invoice.findOne({invoice_id: invoiceId})){
                invoiceId = generate_invoice();
            }

            if (req.user.id){
                orderFields.order_generated_by = req.user.id;
            }
            if (client) orderFields.client = client;
            if (lender_or_bank_name) orderFields.lender_or_bank_name = lender_or_bank_name;
            if (lender_street) orderFields.lender_street = lender_street;
            if (lender_city) orderFields.lender_city = lender_city;
            if (lender_state) orderFields.lender_state = lender_state;
            if (lender_zip_code) orderFields.lender_zip_code = lender_zip_code;
            if (property_street) orderFields.property_street = property_street;
            if (property_city) orderFields.property_city = property_city;
            if (property_state) orderFields.property_state = property_state;
            if (property_zip_code) orderFields.property_zip_code = property_zip_code;
            if (property_country) orderFields.property_country = property_country;
            if (property_on_map) orderFields.property_on_map = property_on_map;
            if (borrower_name) orderFields.borrower_name = borrower_name;
            if (co_borrower_name) orderFields.co_borrower_name = co_borrower_name;
            if (borrower_phone) orderFields.borrower_phone = borrower_phone;
            if (borrower_email) orderFields.borrower_email = borrower_email;
            if (contact_person_name) orderFields.contact_person_name = contact_person_name;
            if (contact_person_phone) orderFields.contact_person_phone = contact_person_phone;
            if (contact_person_email) orderFields.contact_person_email = contact_person_email;
            if (price) orderFields.price = price;
            if (appraisal_type) {
                orderFields.appraisal_type = appraisal_type.split(',').map(appraisal_type => appraisal_type.trim());
            }
            if (loan) orderFields.loan = loan;
            if (loan_type) orderFields.loan_type = loan_type;
            if (appraisal_fee) orderFields.appraisal_fee = appraisal_fee;
            if (appraisar_name) orderFields.appraisar_name = appraisar_name;
            if (due_date) orderFields.due_date = due_date;
            if (note) orderFields.note = note;
            if (order_status) orderFields.order_status = order_status;
            if (req.file) orderFields.order_form = req.file.path;
            orderFields.client_order = clientOrderNo;
            orderFields.order_no = newOrderNo;

            let order = new Order(orderFields);
            if (await order.save()) {
                invoiceFields.client = client;
                invoiceFields.order = order.id;
                invoiceFields.invoice_id = invoiceId;
                invoiceFields.client_order = order.client_order;
                invoiceFields.order_no = order.order_no;
                invoiceFields.city = client_info.city;
                invoiceFields.address_one = client_info.address;
                invoiceFields.state = client_info.state;
                invoiceFields.zip_code = client_info.zip_code;
                invoiceFields.phone = client_info.phones;
                invoiceFields.description = order.appraisal_type;
                invoiceFields.price = order.price;
                invoiceFields.appraisal_fee = order.appraisal_fee;
                if (total_amount) invoiceFields.total_amount = total_amount;
                let invoice = new Invoice(invoiceFields);
                if (await invoice.save())
                {
                    return res.status(200).json({msg: "New order has been placed successfully, Invoice  " + invoice.invoice_id});
                }
                return res.send({error: "Order Placed But Failed To Generate Invoice !!!"})
            }
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    },

    update : async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const {
            client,
            lender_or_bank_name,
            lender_street,
            lender_city,
            lender_state,
            lender_zip_code,
            property_street,
            property_city,
            property_state,
            property_zip_code,
            property_country,
            property_on_map,
            borrower_name,
            co_borrower_name,
            borrower_phone,
            borrower_email,
            contact_person_name,
            contact_person_phone,
            contact_person_email,
            appraisal_types,
            loan,
            client_order,
            loan_type,
            appraisal_fee,
            appraisar_name,
            due_date,
            inspection_date,
            last_call_date,
            order_form,
            note,
            order_status,
            price,
            isDeleted
        } = req.body;

        try {
            const orderFields = {};
            if (client) orderFields.client = client;
            if (lender_or_bank_name) orderFields.lender_or_bank_name = lender_or_bank_name;
            if (lender_street) orderFields.lender_street = lender_street;
            if (lender_city) orderFields.lender_city = lender_city;
            if (lender_state) orderFields.lender_state = lender_state;
            if (lender_zip_code) orderFields.lender_zip_code = lender_zip_code;
            if (property_street) orderFields.property_street = property_street;
            if (property_city) orderFields.property_city = property_city;
            if (property_state) orderFields.property_state = property_state;
            if (property_zip_code) orderFields.property_zip_code = property_zip_code;
            if (property_country) orderFields.property_country = property_country;
            if (property_on_map) orderFields.property_on_map = property_on_map;
            if (borrower_name) orderFields.borrower_name = borrower_name;
            if (co_borrower_name) orderFields.co_borrower_name = co_borrower_name;
            if (price) orderFields.price = price;
            if (borrower_phone) {
                orderFields.borrower_phone = borrower_phone.split(',').map(borrower_phone => borrower_phone.trim());
            }
            if (borrower_email) orderFields.borrower_email = borrower_email;
            if (contact_person_name) orderFields.contact_person_name = contact_person_name;
            if (contact_person_phone){
                orderFields.contact_person_phone = contact_person_phone.split(',').map(contact_person_phone => contact_person_phone.trim());
            }
            if (contact_person_email) orderFields.contact_person_email = contact_person_email;
            if (appraisal_types) {
                orderFields.appraisal_types = appraisal_types.split(',').map(appraisal_types => appraisal_types.trim());
            }
            if (loan) orderFields.loan = loan;
            if (client_order) orderFields.client_order = client_order;
            if (loan_type) orderFields.loan_type = loan_type;
            if (appraisal_fee) orderFields.appraisal_fee = appraisal_fee;
            if (appraisar_name) orderFields.appraisar_name = appraisar_name;
            if (due_date) orderFields.due_date = due_date;
            if (last_call_date) orderFields.last_call_date = last_call_date;
            if (inspection_date) orderFields.inspection_date = inspection_date;
            if (order_form) orderFields.order_form = order_form;
            if (note) orderFields.note = note;
            if (order_status) orderFields.order_status = order_status;
            if (isDeleted) orderFields.isDeleted = isDeleted;
            if (order_form) orderFields.order_form = req.file.path;

            //Update Order Filed
            let order_update = await Order.findOneAndUpdate({_id : req.params.order_id},{$set: orderFields}, {new : true});
            if (order_update){
                if (order_status) {
                    if (order_status === "delivered") {
                        let invoices = await Invoice.findOne({order: req.params.order_id});
                        //let quickBookFields = {};

                        if (invoices){
                            let QbData = {};
                            QbData.invoice = invoices.id;
                            QbData.order_no = invoices.order_no;
                            QbData.client_order = invoices.client_order;
                            QbData.date = invoices.created_at;
                            QbData.address = invoices.address_one + ',' + invoices.state + ',' + ',' +invoices.zip_code + ',' + invoices.city;
                            let QB = helper.sync_to_qb(QbData);
                            return res.status(200).json({msg: "Order Updated and " + QB});
                        }
                        return res.status(200).json({msg: "Order Updated"});
                    }
                }
                return res.status(200).json({ msg : 'Order Updated'});
            }
            return res.status(500).json({errors : { msg: 'Something went wrong !!!'}})

        }catch (e) {
            console.log(e.message);
            return res.status(500).send('Server Error');
        }
    },

    get : async (req, res) => {
        try {
            const order = await Order.find({isDeleted: false}).populate('loan_type').populate('order_generated_by',['email']).select('-password');
            return await res.json(order);

        } catch (e) {
            console.error(e.message);
            return res.status(500).send("Server Error")
        }
    },

    order_by_id: async (req, res) =>{
        try {
            const order = await Order.findOne({_id: req.params.order_id}).populate(['loan_type','appraisal_type']);
            return await res.json(order);
        } catch (e) {
            console.error(e.message);
            return res.status(500).send("Server Error")
        }
    },

    deleted_order: async (req, res) =>{
        try {
            if (req.user.type !== 'Admin'){
                return res.status(401).json({errors: [{msg: "Access Denied !!!"}]})
            }

            const order = await Order.find({isDeleted: true}).populate('loan_type').populate('order_generated_by',['email']).select('-password');
            return await res.json(order);

        } catch (e) {
            console.error(e.message);
            return res.status(500).send("Server Error")
        }
    },

    filter: async (req, res) => {
        let order_no = req.body.order_no;
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        // let client_name = req.body.client_name;
        try {

            if (order_no && start_date && end_date)
            {
                const order = await Order.find({
                    created_at: {
                        $gte: new Date(start_date),
                        $lt: new Date(end_date)
                    },order_no: order_no
                }).populate(['loan_type','appraisal_type']);

                return await res.json(order);
            }
            if (order_no)
            {
                const order = await Order.find({order_no: order_no}).populate(['loan_type','appraisal_type']);
                return await res.json(order);
            }
            if (start_date && end_date)
            {
                const order = await Order.find({
                    created_at: {
                        $gte: new Date(start_date),
                        $lt: new Date(end_date)
                    }
                }).populate(['loan_type','appraisal_type']);

                return await res.json(order);
            }

            // if (client_name)
            // {
            //     return await res.json(Order.find({client_name: { $regex: '.*' + client_name + '.*' } }).populate(['loan_type','appraisal_type']));
            // }

        } catch (e) {
            console.error(e.message);
            return res.status(500).send("Server Error")
        }
    },

    delete : async (req, res) => {
        try {
            if (await Order.findOneAndRemove({_id: req.params.order_id})){
                return  res.json({msg: "Order Deleted Successfully"});
            }
            return res.status(500).json({ msg: "Something went wrong !!"})
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Server Error")
        }
    }
};
function generate_invoice()
{
    return "INV" + Math.floor(1000 + Math.random() * 9000) + new Date().getFullYear().toString()
        + new Date().getMilliseconds().toString();
}

function generate_order_no()
{
    return "BAS"+Math.floor(10000 + Math.random() * 90000) + new Date().getMilliseconds().toString();

}

function generate_client_order()
{
    return  Math.floor(10000 + Math.random() * 90000) + new Date().getMilliseconds().toString();

}
