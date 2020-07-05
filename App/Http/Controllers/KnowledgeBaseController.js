const {validationResult} = require('express-validator');
const KB = require('../../Models/KnowledgeBase');


module.exports = {
    create: async function(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({errors: errors.array()});
        }
        res.send('NOT IMPLEMENTED: Book create Update');
    },

    update : async function(req, res) {
        res.send('NOT IMPLEMENTED: Book create Update');
    },

    get : async function (req, res, next) {
        res.send('NOT IMPLEMENTED: Book create GET');
    },

    delete : async function(req, res) {
        res.send('NOT IMPLEMENTED: Book create DELETE');
    }
};
