const CartModel = require("../models/carts.model")

const projection = {
    products: 1,
}

class CartManager {

    #toCartJson(obj) {
        const cart = obj.toJSON({ virtuals: true })
        delete cart._id
        return cart
    }

    async addCart({ products }) {
        const result = await CartModel.create({ products })
        const newCart = await CartModel.findById(result._id, projection)
        return this.#toCartJson(newCart)
    }

    async getCarts() {
        const carts = await CartModel.find({}, projection)
        return carts.map(p => this.#toCartJson(p))
    }

    async getCartById(id) {
        try {
            const cart = await CartModel
                .findById(
                    id,
                    projection
                )
                .populate('products.product')
            return this.#toCartJson(cart)
        } catch (error) {
            throw new Error(`Cart with id ${id} not found`)
        }

    }

    async updateCart(id, data) {
        try {
            await CartModel.updateOne({ _id: id }, data)
            const updatedCart = await CartModel.findOne({ _id: id }, projection)
            return this.#toCartJson(updatedCart)
        } catch (error) {
            throw new Error(`Cart with id ${id} not found`)
        }
    }

    async deleteCart(id) {
        const result = await CartModel.deleteOne({ _id: id })
        if (result.deletedCount == 0) {
            throw new Error(`Cart with id ${id} not found`)
        }
    }
}

module.exports = CartManager