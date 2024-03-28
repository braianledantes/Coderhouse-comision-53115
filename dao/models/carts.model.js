const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    quantity: { 
        type: Number,
        required: true,
        min: 1
    }
})

const schema = new mongoose.Schema({
    products: [ItemSchema]
}, {
    virtual: {
        id: {
            get() {
                this._id.toString()
            }
        }
    }
})

module.exports = mongoose.model('Cart', schema, 'carts')