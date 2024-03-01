const { Router } = require('express')
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
    const pid = Number.parseInt(req.params.pid)

    if (Number.isNaN(pid)) {
        res.status(400)
        res.json({ error: "Invalid Product ID" })
        return
    }

    try {
        const product = await pm.getProductById(pid)
        res.json({ product })
    } catch (error) {
        res.status(404)
        res.json({ error: "Product not found" })
    }
})

router.post('/', async (req, res) => {
    const newProduct = req.body
    try {
        const productCreated = await pm.addProduct(newProduct)
        res.status(201)
        res.json({ message: "Product created", product: productCreated })
    } catch (error) {
        res.status(400)
        res.json({ error: error.message })
    }
})

router.put('/', async (req, res) => {
    const product = req.body
    try {
        const productUpdated = await pm.updateProduct(product)
        res.json({ product: productUpdated })
    } catch (error) {
        res.status(400)
        res.json({ error: error.message })
    }
})

module.exports = router