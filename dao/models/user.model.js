const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
})

module.exports = mongoose.model('User', schema, 'users')