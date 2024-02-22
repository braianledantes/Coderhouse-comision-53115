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
        if (this.#products.length > 0) {
            return this.#products[this.#products.length - 1].id + 1
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

    async #saveProductsFile() {
        const data = JSON.stringify(this.#products, null, 4)
        await fs.writeFile(this.#path, data)
    }

    #validateProductFields(product) {
        if (!product.code) {
            throw new Error(`Invalid field code ${product.code}`)
        }

        const textFields = ["title", "description", "thumbnail", "code"]
        for (const field of textFields) {
            if (typeof product[field] !== "string") {
                throw new Error(`Invalid field ${field} ${product[field]} must be a string`)
            }
        }
        const numbersFields = ["price", "stock"]
        for (const field of numbersFields) {
            if (typeof product[field] !== 'number' || product[field] < 0) {
                throw new Error(`Invalid field ${field} ${product[field]} must be a positive number`)
            }
        }
    }

    async addProduct({
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    }) {
        const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        this.#validateProductFields(newProduct)

        if (this.#products.some(p => p.code === code)) {
            throw new Error(`Product with code ${code} already exists`)
        }

        
        newProduct.id = this.#getNewId()
        this.#products.push(newProduct)

        await this.#saveProductsFile()
    }

    async getProducts() {
        return this.#products
    }

    async getProductById(id) {
        const product = this.#products.find(p => p.id === id)
        if (!product) {
            throw new Error("Product with id ${id} not found")
        }
        return product
    }
    
    async updateProduct({
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    }) {
        this.#validateProductFields(newProduct)        
        
        const productIndex = this.#products.findIndex(p => p.id === id)
        
        if (productIndex < 0) {
            throw new Error("Product with id ${id} not found")
        }

        this.#products[productIndex] = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        await this.#saveProductsFile()
    }

    async deleteProduct(id) {
        const i = this.#products.findIndex(p => p.id === id)

        if (i >= 0) {
            this.#products.splice(i, 1)

            await this.#saveProductsFile()
        }
    }
}

module.exports = ProductManager