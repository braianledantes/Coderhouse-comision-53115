const { randomUUID } = require('node:crypto')
const fs = require('node:fs/promises')

class CartsManager {
    #path
    #carts

    constructor(path) {
        this.#path = path
    }

    /**
     * This method initialize the carts array from file with the path property.
     */
    async initialize() {
        this.#carts = await this.#getCartsFromFile()
    }

    #getNewId() {
        if (this.#carts.length > 0) {
            return this.#carts[this.#carts.length - 1].id + 1
        } else {
            return 1
        }
    }

    async #getCartsFromFile() {
        try {
            return JSON.parse(await fs.readFile(this.#path, 'utf-8'))
        } catch (error) {
            return []
        }
    }

    async #saveCartsFile() {
        const data = JSON.stringify(this.#carts, null, 4)
        await fs.writeFile(this.#path, data)
    }

    async addCart({ products }) {
        const newCart = {
            id: this.#getNewId(),
            products
        }

        this.#carts.push(newCart)

        await this.#saveCartsFile()
        return newCart
    }

    async getCarts() {
        return this.#carts
    }

    async getCartById(id) {
        const cart = this.#carts.find(c => c.id == id)
        if (!cart) {
            throw new Error(`Cart with id ${id} not found`)
        }
        return cart
    }

    async updateCart(id, data) {
        const index = this.#carts.findIndex(c => c.id == id)

        if (index < 0) {
            throw new Error(`Cart with id ${id} not found`)
        }
        const updatedCart = { ...this.#carts[index], ...data }

        this.#carts[index] = updatedCart

        await this.#saveCartsFile()
        return updatedCart
    }

    async deleteCart(id) {
        const i = this.#carts.findIndex(c => c.id == id)

        if (i === -1) {
            throw new Error(`Cart with id ${id} not found`)
        }

        this.#carts.splice(i, 1)

        await this.#saveCartsFile()
    }
}

module.exports = CartsManager
