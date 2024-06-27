const { Router } = require('express')
const { validateUpdateCart } = require('../middlewares/validations/carts.validations.js')
const { validateUserRoles, ROLES } = require('../middlewares/auth.js')

const createCartsRouter = ({ cartsController }) => {

    const router = Router()

    router.post('/', cartsController.createEmptyCart)

    router.get('/:cid', cartsController.getCart)
    router.put('/:cid', validateUpdateCart, cartsController.updateCartProducts)
    router.delete('/:cid', cartsController.deleteCartProducts)
 
    router.post('/:cid/product/:pid', validateUserRoles(ROLES.NORMAL), cartsController.addProductToCart)
    router.delete('/:cid/products/:pid', cartsController.removeProductFromCart)

    // ticket routes
    router.post('/:cid/purchase', cartsController.createTicket)

    // current cart routes
    router.get('/', cartsController.getCurrentCart)
    router.put('/', validateUpdateCart, cartsController.updateCurrentCartProducts)
    router.delete('/', cartsController.deleteCurrentCartProducts)
 
    router.post('/products/:pid', validateUserRoles(ROLES.NORMAL), cartsController.addProductToCurrentCart)
    router.delete('/products/:pid', cartsController.removeProductFromCurrentCart)

    return router
}

module.exports = createCartsRouter
