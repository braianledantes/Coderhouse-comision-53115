class ProductsService {
    constructor({ productsDao }) {
        this.productsDao = productsDao
    }

    getPaginationProducts = async ({ baseUrl, params }) => {
        let pagination = await this.productsDao.getPaginationProducts(params)
        // crea la url
        const paramsFiltered = Object.keys(params)
            // elimina la propiedad page
            .filter(key => key != 'page')
            // quita las propiedades sin valor
            .filter(key => params[key] != undefined)
            // transforma las propiedades en query params
            .map(key => `${key}=${params[key]}`)
            .join('&')
        const url = `${baseUrl}?${paramsFiltered}`

        // // setea los links de navegacion
        pagination.prevLink = pagination.hasPrevPage ? `${url}&page=${pagination.prevPage}` : null
        pagination.nextLink = pagination.hasNextPage ? `${url}&page=${pagination.nextPage}` : null

        return pagination
    }

    /**
     * Obtiene la lista de productos con un límite de 9999999 productos
     * @param {sort} param0 ordenamiento de los productos
     * @returns lista de productos
     */
    getProducts = async ({ sort }) => {
        const pagination = await this.productsDao.getPaginationProducts({ limit: 9999999, sort })
        return pagination.payload
    }

    getProduct = async ({ productId }) => {
        const product = await this.productsDao.getProductById(productId)
        return { product }
    }

    createProduct = async ({ newProduct }) => {
        const productCreated = await this.productsDao.addProduct(newProduct)
        return productCreated
    }

    updateProduct = async ({ productId, productData }) => {
        const productUpdated = await this.productsDao.updateProduct(productId, productData)
        return productUpdated
    }

    deleteProduct = async ({ productId }) => {
        await this.productsDao.deleteProduct(productId)
    }
}

module.exports = ProductsService