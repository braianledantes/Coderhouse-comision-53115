class CartsService {

    constructor({ cartsDao, productsDao }) {
        this.cartsDao = cartsDao
        this.productsDao = productsDao
    }

    createEmptyCart = async () => {
        const newCart = await this.cartsDao.addCart({ products: [] })
        return newCart
    }

    getCartById = async (cartId) => {
        const cart = await this.cartsDao.getCartById(cartId)
        return cart
    }

    getProductsCart = async (cartId) => {
        const cart = await this.cartsDao.getCartById(cartId)
        return cart.products
    }

    updateCartProducts = async (cartId, newProducts) => {
        const cart = await this.cartsDao.getCartById(cartId)
        cart.products = newProducts

        const updatedCart = await this.cartsDao.updateCart(cartId, cart)

        return updatedCart
    }

    deleteCartProducts = async (cartId) => {
        const cart = await this.cartsDao.getCartById(cartId)
        cart.products = []

        const updatedCart = await this.cartsDao.updateCart(cartId, cart)

        return updatedCart
    }

    addProductToCart = async (cartId, productId) => {
        const cart = await this.cartsDao.getCartById(cartId)
        // verifica que exista el producto, si no existe lanza un error
        const existsProduct = await this.productsDao.getProductById(productId)
        if (!existsProduct) {
            throw new Error(`Product with id ${productId} not found`)
        }

        const productCart = cart.products.find(e => e.product.id == productId)
        if (productCart) {
            productCart.quantity++
        } else {
            const newProductCart = { product: productId, quantity: 1 }
            cart.products.push(newProductCart)
        }

        const updatedCart = await this.cartsDao.updateCart(cartId, cart)

        return updatedCart
    }

    removeProductFromCart = async (cartId, productId) => {
        const cart = await this.cartsDao.getCartById(cartId)
        // verifica que exista el producto, si no existe lanza un error
        const existsProduct = await this.productsDao.getProductById(productId)
        if (!existsProduct) {
            throw new Error(`Product with id ${productId} not found`)
        }

        const pIndex = cart.products.findIndex(e => e.product.id == productId)
        if (pIndex != -1) {
            cart.products.splice(pIndex, 1)
            const updatedCart = await this.cartsDao.updateCart(cartId, cart)

            return updatedCart
        }

        throw new Error(`Product with id ${productId} not found in this cart ${cartId}`)
    }
}

module.exports = CartsService