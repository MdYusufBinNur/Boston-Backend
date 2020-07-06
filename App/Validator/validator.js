const {check} = require('express-validator');
exports.createPayment =
    [
        check('payment').isEmpty()
    ];

/**
 * Here KB means Knowledge Base :v
 * @type ValidityState
 */
exports.check_kb =
    [
        check('title', 'Title Is Required').not().isEmpty(),
    ];

exports.check_kb_category =
    [
        check('name', 'Category Name Is Required').not().isEmpty(),
    ];

exports.check_client_note =
    [
        check('client','Please select a client').not().isEmpty()
    ]
