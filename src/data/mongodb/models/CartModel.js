const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    { _id: false }
)

const cartSchema = new mongoose.Schema({
    products: {
        type: [itemSchema],
        default: []
    }
}, {
    virtual: {
        id: {
            get() {
                this._id.toString()
            }
        }
    }
})

const CartModel = mongoose.model('Cart', cartSchema, 'carts')

module.exports = { CartModel }