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
        check('client', 'Please select a client').not().isEmpty()
    ];

exports.appraisal =
    [
        check('appraisal_name', 'Appraisal Type Name Is Required').not().isEmpty()
    ];

exports.check_client =
    [
        check('username', 'UserName Is Required').not().isEmpty(),
        check('company_name', 'Company Name Is Required').not().isEmpty(),
        check('contact_name', 'Contact Name Is Required').not().isEmpty(),
        check('address', 'Address Is Required').not().isEmpty(),
        check('city', 'City Is Required').not().isEmpty(),
        check('state', 'State Is Required').not().isEmpty(),
        check('zip_code', 'Zip Code Is Required').not().isEmpty(),
        check('phones', 'Phone Number Is Required').not().isEmpty(),
        check('email', 'Please input a valid email').isEmail(),
        check('password', 'Please enter password with 6 or more character').isLength({min: 6})
    ];

exports.check_page =
    [
        check('name', 'Name Is Required').not().isEmpty()
    ];

exports.check_cms =
    [
        check('page', 'Please Select A Page').not().isEmpty(),
        check('name', 'Page Name Is Required').not().isEmpty(),
        check('title', 'Page Title Is Required').not().isEmpty(),
    ];

exports.check_invoice =
    [
        check('client', 'Please Select A Client').not().isEmpty(),
        check('order', 'Please Select An Order').not().isEmpty(),
        check('address_one', 'Address is required').not().isEmpty(),
        check('city', 'City is required').not().isEmpty(),
        check('state', ' State is required').not().isEmpty(),
        check('zip_code', ' Zip Code is required').not().isEmpty(),
        check('phone', 'Phone Number is required').not().isEmpty(),
        check('description', 'Property city is required').not().isEmpty(),
        check('price', 'Price is required').not().isEmpty(), // Here Amount is declared as Price
        check('total_amount', 'Total Amount is required').not().isEmpty(),
        check('appraisal_fee', 'Appraisal Fee is required').not().isEmpty(),
    ];

exports.check_loan =
    [
        check('loan_type_name', 'Loan Type Name Is Required').not().isEmpty()
    ];

exports.check_message =
    [
        check('receiver', 'Receiver is required')
    ];

exports.check_order =
    [
        check('client', 'Please Select A Client').not().isEmpty(),
        check('lender_or_bank_name', 'Lender name is required').not().isEmpty(),
        check('lender_street', 'Lender Street is required').not().isEmpty(),
        check('lender_city', 'Lender City is required').not().isEmpty(),
        check('lender_state', 'Lender State is required').not().isEmpty(),
        check('lender_zip_code', 'Lender Zip Code is required').not().isEmpty(),
        check('property_street', 'Property street is required').not().isEmpty(),
        check('property_city', 'Property city is required').not().isEmpty(),
        check('property_state', 'Property state is required').not().isEmpty(),
        check('property_zip_code', 'Property Zip Code is required').not().isEmpty(),
        check('property_country', 'Property Country is required').not().isEmpty(),
        check('borrower_name', 'Borrower name is required').not().isEmpty(),
        check('borrower_phone', 'Borrower mobile is required').not().isEmpty(),
        check('borrower_email', 'Borrower email is required').not().isEmpty(),
        check('appraisal_type', 'Please Select A Appraisal Tpes').not().isEmpty(),
        check('client_order', 'Client order is required').not().isEmpty(),
        check('loan_type', 'Loan type is required').not().isEmpty(),
        check('appraiser_name', 'Appraiser name is required').not().isEmpty(),
        // check('order_form', 'Order Form is required').not().isEmpty(),
        check('price', 'Appraisal Price is required').not().isEmpty()
    ];

exports.check_payment =
    [
        check('invoice', 'Please Select A Invoice').not().isEmpty(),
    ];

exports.check_cheque_no =
    [
        check('cheque_no', 'Please Input Cheque Number').not().isEmpty(),
    ];

exports.check_property =
    [
        check('property_name', 'Property Name Is Required').not().isEmpty()

    ];

exports.check_qb =
    [
        check('invoice', 'Invoice Is Required').not().isEmpty(),
        check('order_no', 'Order No Is Required').not().isEmpty(),
        check('client_order', 'Client Order No Is Required').not().isEmpty(),
    ];

exports.check_slider =
    [
        check('slider_image', 'Slider Image is required').not().isEmpty(),
    ];

exports.check_user =
    [
        check('first_name', 'First Name Is Required').not().isEmpty(),
        check('last_name', 'Last Name Is Required').not().isEmpty(),
        check('address', 'Address Is Required').not().isEmpty(),
        check('phones', 'Phone Number Is Required').not().isEmpty(),
        check('email', 'Please input a valid email').isEmail(),
        check('password', 'Please enter password with 6 or more character').isLength({min: 6})
    ];

exports.check_login =
    [
        check('email', 'Please input a valid email').isEmail(),
        check('password','Password is required').exists()
    ]
