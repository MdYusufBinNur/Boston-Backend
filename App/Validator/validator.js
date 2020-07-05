const {check} = require('express-validator');
exports.createPayment =
    [
        check('payment').isEmpty()
    ];

exports.checkKB =
    [
        check('title', 'Title Is Required').not().isEmpty(),
    ];

exports.check_kb_category =
    [
        check('name', 'Category Name Is Required').not().isEmpty(),
    ];
