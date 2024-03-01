const { randomUUID } = require('node:crypto')
const fs = require('node:fs/promises')

class ProductManager {
    #path

    constructor(path) {
        this.#path = path
    }

    #getNewId(products) {
        if (products.length > 0) {
            return products[products.length - 1].id + 1
        } else {
            return 1
        }
    }

    async #getProductsFromFile() {
        try {
            return JSON.parse(await fs.readFile(this.#path, 'utf-8'))
        } catch (error) {
            return []
        }
    }

    async #saveProductsFile(products) {
        const data = JSON.stringify(products, null, 4)
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
        const products = await this.#getProductsFromFile()
        const newProduct = {
            id: this.#getNewId(products),
            code,
            title,
            description,
            thumbnail,
            stock,
            price
        }      

        if (products.some(p => p.code == code)) {
            throw new Error(`Product with code ${code} already exists`)
        }

        products.push(newProduct)

        await this.#saveProductsFile(products)
        return newProduct
    }

    async getProducts() {
        return await this.#getProductsFromFile()
    }

    async getProductById(id) {
        const products = await this.#getProductsFromFile()
        const product = products.find(p => p.id == id)
        if (!product) {
            throw new Error(`Product with id ${id} not found`)
        }
        return product
    }

    async updateProduct(id, data) {
        const products = await this.#getProductsFromFile()
        const productIndex = products.findIndex(p => p.id == id)

        if (productIndex < 0) {
            throw new Error(`Product with id ${id} not found`)
        }
        const updatedProduct = { ...products[productIndex], ...data }

        products[productIndex] = updatedProduct

        await this.#saveProductsFile(products)
        return updatedProduct
    }

    async deleteProduct(id) {
        const products = await this.#getProductsFromFile()
        const i = products.findIndex(p => p.id == id)

        if (i === -1) {
            throw new Error(`Product with id ${id} not found`)
        }

        products.splice(i, 1)

        await this.#saveProductsFile(products)
    }
}

module.exports = ProductManager
