const { Router } = require('express')
const { validateGetProducts, validateNewProduct, validateUpdateProduct } = require('../validations/products.validations.js')
const ProductManager = require('../dao/dbManagers/ProductManager.js')

const pm = new ProductManager('./assets/productos.json')

const router = Router()

router.get('/', validateGetProducts, async (req, res) => {
    const limit = Number.parseInt(req.query.limit)

    let products = await pm.getProducts()

    if (limit && limit >= 0) {
        products = products.slice(0, limit)
    }
    res.json({ products })
})

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid

    try {
        const product = await pm.getProductById(pid)
        res.json({ product })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

router.post('/', validateNewProduct, async (req, res) => {
    const newProduct = req.body
    try {
        const productCreated = await pm.addProduct(newProduct)

        req.app.get('websocket').emit('product-created', { product: productCreated })

        res.status(201)
            .json({ message: "Product created", product: productCreated })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.put('/:pid', validateUpdateProduct, async (req, res) => {
    const data = req.body
    const pid = req.params.pid
    try {
        const productUpdated = await pm.updateProduct(pid, data)
        req.app.get('websocket').emit('product-updated', { product: productUpdated })

        res.json({ product: productUpdated })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        await pm.deleteProduct(pid)

        req.app.get('websocket').emit('product-deleted', { productId: pid })

        res.json({ message: `Product ${pid} deleted` })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router