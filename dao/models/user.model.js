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
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    role: {
        type: String,
        require: true,
        default: "user"
    }
})

module.exports = mongoose.model('User', schema, 'users')