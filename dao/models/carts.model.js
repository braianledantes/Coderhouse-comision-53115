const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema(
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

const schema = new mongoose.Schema({
    products: {
        type: [ItemSchema],
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

module.exports = mongoose.model('Cart', schema, 'carts')