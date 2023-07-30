const { model, Schema } = require('mongoose');
const { Types } = require('mongoose');

module.exports = model('EconomySchema',
    new Schema({
        guild: String,
        user: String,
        balance: { type: Number, default: 0 }
    })
);