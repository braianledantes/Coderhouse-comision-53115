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

    async getProducts({ limit, page, category, availability, sort }) {
        try {
            // crea la consulta para aplicar el filtro
            const andArray = []
            if (category) {
                andArray.push({ category })
            }
            // el producto está disponible si su estado es verdadero y hay stock
            if (availability == true) {
                andArray.push({ status: true })
                andArray.push({ stock: { $gt: 0 } })
            } else if (availability == false) {
                andArray.push({ $or: [{ status: false }, { stock: 0 }] })
            }

            const query = andArray.length > 0 ? { $and: andArray } : {}

            const result = await ProductModel.paginate(
                query,
                {
                    sort: sort ? { price: sort } : undefined,
                    limit: limit,
                    page: page,
                    projection,
                    lean: true
                }
            )

            // Transforma el resultado a lo esperado por el cliente
            return {
                status: "success",
                payload: result.docs.map(p => ({ ...p, thumbnail: p.thumbnail[0] })),
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage
            }
        } catch (error) {
            return {
                status: "error"
            }
        }
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