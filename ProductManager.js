class ProductManager {
    #lastId = 0
    #products

    constructor() {
        this.#products = []
    }

    #getNewId() {
        this.#lastId++
        return this.#lastId
    }

    addProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    ) {

        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        const textFields = ["title", "description", "thumbnail", "code"]
        for (const field of textFields) {
            product[field]
        }

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Invalid field");
            return
        }

        if (this.#products.find(p => p.code === code)) {
            console.error(`Product with code ${code} already exists`)
            return
        }

        this.#products.push({
            id: this.#getNewId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        })
    }

    getProducts() {
        return this.#products
    }

    getProductById(id) {
        const product = this.#products.find(p => p.id === id)
        if (!product) {
            console.error("Not found")
            return
        }
        return product
    }
}
