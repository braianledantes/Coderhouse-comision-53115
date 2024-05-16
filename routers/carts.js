const { Router } = require('express')
const { validateUpdateCart } = require('../validations/carts.validations.js')

const createCartsRouter = ({ cartsController }) => {

    const router = Router()

    router.post('/', cartsController.createEmptyCart)

    router.get('/:cid', cartsController.getCart)
    router.put('/:cid', validateUpdateCart, cartsController.updateCartProducts)
    router.delete('/:cid', cartsController.deleteCartProducts)
 
    router.post('/:cid/product/:pid', cartsController.addProductToCart)
    router.delete('/:cid/products/:pid', cartsController.removeProductFromCart)

    return router
}

module.exports = createCartsRouter
