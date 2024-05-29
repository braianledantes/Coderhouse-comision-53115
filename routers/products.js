const { Router } = require('express')
const { validateGetProducts, validateNewProduct, validateUpdateProduct } = require('../middlewares/validations/products.validations')
const { isUserAdmin } = require('../middlewares/auth')

const createProductsRouter = ({ productsController }) => {
    const router = Router()

    router.get('/', validateGetProducts, productsController.getPaginationProducts)
    router.post('/', isUserAdmin, validateNewProduct, productsController.createProduct)
    
    router.get('/:pid', productsController.getProduct)
    router.put('/:pid', isUserAdmin, validateUpdateProduct, productsController.updateProduct)
    router.delete('/:pid', isUserAdmin, productsController.deleteProduct)

    return router
}

module.exports = createProductsRouter