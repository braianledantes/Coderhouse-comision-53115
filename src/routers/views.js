const { Router } = require('express')
const { validateGetProducts } = require('../middlewares/validations/products.validations')
const { userIsLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth')

const createViewRouter = ({ viewsController }) => {
    const router = Router()

    router.get('/', viewsController.index)
    router.get('/home', viewsController.home)
    router.get('/products', userIsLoggedIn, validateGetProducts, viewsController.paginationProducts)
    router.get('/products/:pid', userIsLoggedIn, viewsController.getProduct)
    router.get('/realtimeproducts', userIsLoggedIn, viewsController.realtimeproducts)
    router.get('/chat', userIsLoggedIn, viewsController.chat)
    router.get('/carts', userIsLoggedIn, viewsController.cart)
    router.get('/login', userIsNotLoggedIn, viewsController.login)
    router.get('/register', userIsNotLoggedIn, viewsController.register)
    router.get('/profile', userIsLoggedIn, viewsController.profile)

    return router
}

module.exports = createViewRouter