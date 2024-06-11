const { Router } = require('express')
const { validateGetProducts, validateNewProduct, validateUpdateProduct } = require('../middlewares/validations/products.validations')
const { isUserAdmin, userIsLoggedIn } = require('../middlewares/auth')

const createProductsRouter = ({ productsController }) => {
    const router = Router()

    router.get('/', validateGetProducts, productsController.getPaginationProducts)
    router.post('/', userIsLoggedIn, isUserAdmin, validateNewProduct, productsController.createProduct)

    router.get('/:pid', productsController.getProduct)
    router.put('/:pid', userIsLoggedIn, isUserAdmin, validateUpdateProduct, productsController.updateProduct)
    router.delete('/:pid', userIsLoggedIn, isUserAdmin, productsController.deleteProduct)

    return router
}

module.exports = createProductsRouter