const { Router } = require('express')
const { validatePartialProduct, validateProduct } = require('../schemas/products.schema.js')
const ProductManager = require('../datamanagers/ProductManager.js')

const pm = new ProductManager('./assets/products.json');

(async () => {
    await pm.initialize()
})()

const router = Router()

router.get('/', async (req, res) => {
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

router.post('/', (req, res, next) => {
    const result = validateProduct(req.body)
    if (result.success) {
        next()
    } else {
        res.status(400).json({ message: JSON.parse(result.error.message) })
    }
}, async (req, res) => {
    const newProduct = req.body
    try {
        const productCreated = await pm.addProduct(newProduct)
        res.status(201)
            .json({ message: "Product created", product: productCreated })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.put('/:pid', (req, res, next) => {
    const result = validatePartialProduct(req.body)
    if (result.success) {
        req.body = result.data
        next()
    } else {
        res.status(400).json({ message: JSON.parse(result.error.message) })
    }
}, async (req, res) => {
    const data = req.body
    const pid = req.params.pid
    try {
        const productUpdated = await pm.updateProduct(pid, data)
        res.json({ product: productUpdated })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        await pm.deleteProduct(pid)
        res.json({ message: `Product ${pid} deleted` })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router