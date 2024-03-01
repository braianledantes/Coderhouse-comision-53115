const { randomUUID } = require('node:crypto')
const fs = require('node:fs/promises')

class CartsManager {
    #path

    constructor(path) {
        this.#path = path
    }

    #getNewId(carts) {
        if (carts.length > 0) {
            return carts[carts.length - 1].id + 1
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

    async #saveCartsFile(carts) {
        const data = JSON.stringify(carts, null, 4)
        await fs.writeFile(this.#path, data)
    }

    async addCart({ products }) {
        const carts = await this.#getCartsFromFile()
        const newCart = {
            id: this.#getNewId(carts),
            products
        }

        carts.push(newCart)

        await this.#saveCartsFile(carts)
        return newCart
    }

    async getCarts() {
        return await this.#getCartsFromFile()
    }

    async getCartById(id) {
        const carts = await this.#getCartsFromFile()
        const cart = carts.find(c => c.id == id)
        if (!cart) {
            throw new Error(`Cart with id ${id} not found`)
        }
        return cart
    }

    async updateCart(id, data) {
        const carts = await this.#getCartsFromFile()
        const index = carts.findIndex(c => c.id == id)

        if (index < 0) {
            throw new Error(`Cart with id ${id} not found`)
        }
        const updatedCart = { ...carts[index], ...data }

        carts[index] = updatedCart

        await this.#saveCartsFile(carts)
        return updatedCart
    }

    async deleteCart(id) {
        const carts = await this.#getCartsFromFile()
        const i = carts.findIndex(c => c.id == id)

        if (i === -1) {
            throw new Error(`Cart with id ${id} not found`)
        }

        carts.splice(i, 1)

        await this.#saveCartsFile(carts)
    }
}

module.exports = CartsManager
