const ProductModel = require("../models/product.model")

const projection = {
    code: 1,
    title: 1,
    description: 1,
    thumbnail: 1,
    stock: 1,
    price: 1,
    category: 1,
    status: 1
}

class ProductManager {

    #toProductJson(obj) {
        const product = obj.toJSON({ virtuals: true })
        delete product._id
        return product
    }

    async addProduct(product) {
        try {
            const result = await ProductModel.create(product)
            const newProduct = await ProductModel.findById(result._id, projection)
            return this.#toProductJson(newProduct)
        } catch (error) {
            throw new Error(`Product with code ${code} already exists`)
        }
    }

    async getProducts({ limit, page, query, sort }) {
        // TODO ver qué enviar en la query
        const pQuery = { status: false }

        return await ProductModel.paginate(
            pQuery,
            {
                sort: sort ? { price: sort } : undefined,
                limit: limit,
                page: page,
                projection,
                lean: true
            }
        )
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(
                id,
                projection
            )
            return this.#toProductJson(product)
        } catch (error) {
            throw new Error(`Product with id ${id} not found`)
        }

    }

    async updateProduct(id, data) {
        try {
            await ProductModel.updateOne({ _id: id }, data)
            const updatedProduct = await ProductModel.findOne({ _id: id }, projection)
            return this.#toProductJson(updatedProduct)
        } catch (error) {
            throw new Error(`Product with id ${id} not found`)
        }
    }

    async deleteProduct(id) {
        const result = await ProductModel.deleteOne({ _id: id })
        if (result.deletedCount == 0) {
            throw new Error(`Product with id ${id} not found`)
        }
    }
}

module.exports = ProductManager