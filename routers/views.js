const { Router } = require('express')
const { validateGetProducts } = require('../middlewares/validations/products.validations')
const { userIsLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth')

const createViewRouter = ({ viewsController }) => {
    const router = Router()

    router.get('/', viewsController.index)
    router.get('/home', viewsController.home)
    router.get('/products', validateGetProducts, viewsController.paginationProducts)
    router.get('/products/:pid', viewsController.getProduct)
    router.get('/realtimeproducts', viewsController.realtimeproducts)
    router.get('/chat', viewsController.chat)    
    router.get('/carts/:cid', viewsController.cart)    
    router.get('/login', userIsNotLoggedIn, viewsController.login)    
    router.get('/register', userIsNotLoggedIn, viewsController.register)    
    router.get('/profile', userIsLoggedIn, viewsController.profile)

    return router
}

module.exports = createViewRouter