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
    },

    generate_csv: function(data){
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        for (const row of data){
            const values = headers.map(header => {
                const escaped = (''+row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });

            csvRows.push(values.join(','))
        }
        return csvRows.join('\n');
    },

    download_csv: function(data){
      const blob = new Blob([data],{type : 'text/csv'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden','');
      a.setAttribute('href', url);
      a.setAttribute('download', 'download.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    generate_invoice: () => {
        let data = "INV" + Math.floor(1000 + Math.random() * 9000) + new Date().getFullYear().toString()
            + new Date().getMilliseconds().toString();
        return res.send(data);
    },

    generate_order_no: () => {
        return "BAS"+Math.floor(10000 + Math.random() * 90000) + new Date().getMilliseconds().toString();
    },

    generate_client_order: () => {
        return  Math.floor(10000 + Math.random() * 90000) + new Date().getMilliseconds().toString();
    },

};



