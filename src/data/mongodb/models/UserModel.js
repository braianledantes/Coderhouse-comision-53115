const mongoose = require('mongoose')
const { ROLES } = require('../../userRoles')

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
        enum: ROLES,
        require: true,
        default: "premium" // TODO cambiar a "user"
    },
    lastConnection: {
        type: Date,
        default: Date.now
    }
})

const UserModel = mongoose.model('User', schema, 'users')

module.exports = { UserModel }