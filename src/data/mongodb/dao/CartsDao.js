const { th } = require("@faker-js/faker")
const { CustomError } = require("../../../errors/CustomError")
const ERROR_CODES = require("../../../errors/errorCodes")
const { CartModel } = require("../models/CartModel")

const projection = {
    products: 1,
}

class CartsDao {

    #toCartJson(obj) {
        const cart = obj.toJSON({ virtuals: true })
        delete cart._id
        return cart
    }

    async createEmptyCart() {
        try {
            const result = await CartModel.create({ products: [] })
            const newCart = await CartModel.findById(result._id, projection)
            return this.#toCartJson(newCart)
        } catch (error) {
            throw new CustomError({
                name: 'CartCreationError',
                message: 'Error while creating cart',
                code: ERROR_CODES.DATABASE_ERROR
            })
        }
    }

    async addCart({ products }) {
        try {
            const result = await CartModel.create({ products })
            const newCart = await CartModel.findById(result._id, projection)
            return this.#toCartJson(newCart)
        } catch (error) {
            throw new CustomError({
                name: 'CartCreationError',
                message: 'Error while creating cart with products',
                code: ERROR_CODES.DATABASE_ERROR
            })
        }
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
            if (error.name == 'MongoServerError' && error.code == 11000) {
                // Throw a custom error if the product already exists
                const err = new CustomError({
                    name: 'CartAlreadyExists',
                    message: `Cart with id ${id} already exists`,
                    code: ERROR_CODES.INVALID_INPUT
                })
                throw err
            } else {
                // Throw a database error
                throw new CustomError({
                    name: 'DatabaseError',
                    message: 'Error while creating cart',
                    code: ERROR_CODES.DATABASE_ERROR
                })
            }
        }

    }

    async updateCart(id, data) {
        try {
            await CartModel.updateOne({ _id: id }, data)
            const updatedCart = await CartModel.findOne({ _id: id }, projection)
            return this.#toCartJson(updatedCart)
        } catch (error) {
            if (error.name == 'MongoServerError' && error.code == 11000) {
                // Throw a custom error if the product already exists
                const err = new CustomError({
                    name: 'CartAlreadyExists',
                    message: `Cart with id ${id} already exists`,
                    code: ERROR_CODES.INVALID_INPUT
                })
                throw err
            } else {
                // Throw a database error
                throw new CustomError({
                    name: 'DatabaseError',
                    message: 'Error while creating cart',
                    code: ERROR_CODES.DATABASE_ERROR
                })
            }
        }
    }

    async deleteCart(id) {
        const result = await CartModel.deleteOne({ _id: id })
        if (result.deletedCount == 0) {
            throw new CustomError({
                name: 'CartNotFound',
                message: `Cart with id ${id} not found`,
                code: ERROR_CODES.INVALID_INPUT
            })
        }
    }
}

module.exports = CartsDao