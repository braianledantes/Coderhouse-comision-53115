const { randomUUID } = require('node:crypto')
const fs = require('node:fs/promises')

class ProductManager {
    #path
    #products

    constructor(path) {
        this.#path = path
    }

    /**
     * This method initialize the products array from file with the path property.
     */
    async initialize() {
        this.#products = await this.#getProductsFromFile()
    }

    #getNewId() {
        return randomUUID()
    }

    async #getProductsFromFile() {
        try {
            return JSON.parse(await fs.readFile(this.#path, 'utf-8'))
        } catch (error) {
            return []
        }
    }

    async #saveProductsFile() {
        const data = JSON.stringify(this.#products, null, 4)
        await fs.writeFile(this.#path, data)
    }

    async addProduct({
        code,
        title,
        description,
        thumbnail,
        stock,
        price
    }) {
        const newProduct = {
            id: this.#getNewId(),
            code,
            title,
            description,
            thumbnail,
            stock,
            price
        }

        if (this.#products.some(p => p.code === code)) {
            throw new Error(`Product with code ${code} already exists`)
        }

        this.#products.push(newProduct)

        await this.#saveProductsFile()
        return newProduct
    }

    async getProducts() {
        return this.#products
    }

    async getProductById(id) {
        const product = this.#products.find(p => p.id === id)
        if (!product) {
            throw new Error(`Product with id ${id} not found`)
        }
        return product
    }

    async updateProduct(id, data) {
        const productIndex = this.#products.findIndex(p => p.id === id)

        if (productIndex < 0) {
            throw new Error(`Product with id ${id} not found`)
        }
        const updatedProduct = { ...this.#products[productIndex], ...data }

        this.#products[productIndex] = updatedProduct

        await this.#saveProductsFile()
        return updatedProduct
    }

    async deleteProduct(id) {
        const i = this.#products.findIndex(p => p.id === id)

        if (i === -1) {
            throw new Error(`Product with id ${id} not found`)
        }

        this.#products.splice(i, 1)

        await this.#saveProductsFile()
    }
}

module.exports = ProductManager
