const mongoose = require('mongoose');

const unicorns = mongoose.model('unicorns', new mongoose.Schema({
    name: String,
    dob: String,
    gender: String,
    loves: [String],
    vampires: Number,
    weight: Number,
}));

module.exports = { unicorns };
