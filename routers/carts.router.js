const { Router } = require('express')
const CartsManager = require('../datamanagers/CartsManager.js')
const ProductManager = require('../datamanagers/ProductManager.js')
const { validateProductCart } = require('../schemas/productCart.schema.js')

const cm = new CartsManager('./assets/corritos.json')
const pm = new ProductManager('./assets/productos.json');

(async () => {
    await Promise.all([cm.initialize(), pm.initialize()])
})()

const router = Router()

router.post('/', async (req, res) => {
    const result = validateProductCart(req.body)
    if (result.success) {
        const newCart = await cm.addCart(result.data)
        res.status(201).json(newCart)
    } else {
        res.status(400).json({ message: JSON.parse(result.error.message) })
    }

})

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid

    try {
        const cart = await cm.getCartById(cid)
        res.json({ products: cart.products })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)

    if (isNaN(cid)) {
        return res.status(400).json({ message: "Invalid cart ID" })
    }

    if (isNaN(pid)) {
        return res.status(400).json({ message: "Invalid product ID" })
    }

    try {
        const cart = await cm.getCartById(cid)
        // verifica que exista el producto, si no existe lanza un error
        await pm.getProductById(pid)

        const productCart = cart.products.find(e => e.product == pid)
        if (productCart) {
            productCart.quantity++
        } else {
            const newProductCart = { product: pid, quantity: 1 }
            cart.products.push(newProductCart)
        }

        const updatedCart = await cm.updateCart(cid, cart)

        res.json(updatedCart)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

module.exports = router
