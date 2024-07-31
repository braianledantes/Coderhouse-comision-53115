const { ROLES } = require("../data/userRoles")
const { sendEmail } = require("../utils/email")

class ProductsService {
    constructor({ productsDao, usersDao }) {
        this.productsDao = productsDao
        this.usersDao = usersDao
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

    createProduct = async ({ newProduct, userEmail }) => {
        const user = await this.usersDao.getUserByEmail({ email: userEmail })
        // asigna el id del usuario al producto
        newProduct.owner = user.id

        const productCreated = await this.productsDao.addProduct(newProduct)
        return productCreated
    }

    updateProduct = async ({ productId, productData, userEmail }) => {
        const user = await this.usersDao.getUserByEmail({ email: userEmail })

        if (user.role === ROLES.ADMIN) {
            await this.productsDao.updateProductOwner(productId, productData, user.id)
        } else {
            const productUpdated = await this.productsDao.updateProduct(productId, productData)
            return productUpdated
        }
    }

    /**
     * Elimina un producto, si el usuario es admin elimina el producto, si es premium elimina el
     * producto si es suyo y envía un correo
     */
    deleteProduct = async ({ productId, userEmail }) => {
        const user = await this.usersDao.getUserByEmail({ email: userEmail })

        if (user.role === ROLES.ADMIN) {
            await this.productsDao.deleteProduct(productId)
        } else {
            const productDeleted = await this.productsDao.deleteProductOwner(productId, user.id)

            if (productDeleted && user.role === ROLES.PREMIUM) {

                await sendEmail({
                    email: user.email,
                    subject: 'Producto eliminado',
                    text: `El producto con código ${productDeleted.code} ha sido eliminado, si no fuiste tú, contacta a soporte`
                })

            }
        }
    }
}

module.exports = ProductsService