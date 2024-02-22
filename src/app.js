const express = require('express')
const ProductManager = require('./ProductManager.js')

const pm = new ProductManager('./products.json')

const app = express()
const PORT = 8080

app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req, res) => {
    const limit = Number.parseInt(req.query.limit)

    const products = await pm.getProducts()

    if (!limit || limit < 0) {
        res.json({ products })
    } else {
        res.json({ products: products.slice(0, limit) })
    }
})

app.get('/products/:pid', async (req, res) => {
    const pid = Number.parseInt(req.params.pid)

    try {
        const product = await pm.getProductById(pid)
        res.json({ product })
    } catch (error) {
        res.status(400)
        res.json({ error: "Product not found"})
    }
})

app.listen(PORT, async () => {
    await pm.initialize()
    console.log(`App listening on port ${PORT}`);
})