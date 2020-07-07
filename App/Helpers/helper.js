const QB = require('../Models/QuickBook');

module.exports = {
    sync_to_qb :  function (data) {
        //return data;
        const {
            invoice,
            order_no,
            status,
            client_order,
            date,
            address,
            isDeleted
        } = data;

        try {
            const QBFields = {};

            if (!invoice) {
                return "No Invoice found to sync with QuickBook"
            }
            if (invoice) QBFields.invoice = invoice;
            if (order_no) QBFields.order_no = order_no;
            if (status) QBFields.status = status;
            if (client_order) QBFields.client_order = client_order;
            if (address) QBFields.address = address;
            if (date) QBFields.date = date;
            if (isDeleted) QBFields.isDeleted = isDeleted;

            //return QB.findOne({order_no : order_no});
            let quickBook = new QB(QBFields);
            if (quickBook.save()){
                return "Added To QuickBook"
            }

        } catch (e) {
            return e.message;
        }
    }
};
