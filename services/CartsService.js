class CartsService {

    constructor({ cartsDao, productsDao, ticketDao, usersDao }) {
        this.cartsDao = cartsDao
        this.productsDao = productsDao
        this.ticketDao = ticketDao
        this.usersDao = usersDao
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

    createTicket = async (cartId) => {
        const cart = await this.cartsDao.getCartById(cartId)

        // si no hay productos en el carrito, lanza un error
        if (cart.products.length == 0) {
            throw new Error(`Cart with id ${cartId} is empty`)
        }

        // obtener mail del usuario del carrito de la bd
        const user = await this.usersDao.getUserByCartId(cartId)
        const userEmail = user.email

        let amount = 0

        // verifica que haya stock suficiente para los productos del carrito
        for (const productCart of cart.products) {
            const product = await this.productsDao.getProductById(productCart.product)
            if (product.stock < productCart.quantity) {
                throw new Error(`Product with code ${product.code} has not enough stock`)
            }
            // suma el total de la compra
            amount += product.price * productCart.quantity
        }
        
        const newTicket = await this.ticketDao.createTicket({ amount, purchaser: userEmail })

        // elimina los productos del carrito
        await this.cartsDao.updateCart(cartId, { products: [] })

        return newTicket
    }
}

module.exports = CartsService