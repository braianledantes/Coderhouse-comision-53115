const express = require('express')
const ProductManager = require('./ProductManager.js')

const pm = new ProductManager('./assets/products.json')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req, res) => {
    const limit = Number.parseInt(req.query.limit)

    let products = await pm.getProducts()

    if (limit && limit >= 0) {
        products = products.slice(0, limit)
    }
    res.json({ products })
})

app.get('/products/:pid', async (req, res) => {
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

app.post('/products', async (req, res) => {
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

app.listen(PORT, async () => {
    await pm.initialize()
    console.log(`App listening on port ${PORT}`);
})