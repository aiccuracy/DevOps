const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCount = new Schema({
    name: { type: String },
    totalUser: { type: Number}
})

module.exports = mongoose.model('userCount', userCount);
