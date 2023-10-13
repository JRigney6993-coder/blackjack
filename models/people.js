const mongoose = require('mongoose');

const User = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Users', User);


