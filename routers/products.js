const { Router } = require('express')
const { validateGetProducts, validateNewProduct, validateUpdateProduct } = require('../middlewares/validations/products.validations')

const createProductsRouter = ({ productsController }) => {
    const router = Router()

    router.get('/', validateGetProducts, productsController.getPaginationProducts)
    router.post('/', validateNewProduct, productsController.createProduct)
    
    router.get('/:pid', productsController.getProduct)
    router.put('/:pid', validateUpdateProduct, productsController.updateProduct)
    router.delete('/:pid', productsController.deleteProduct)

    return router
}

module.exports = createProductsRouter