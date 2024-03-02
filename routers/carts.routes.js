const { Router } = require('express')
const CartsManager = require('../datamanagers/CartsManager.js')
const ProductManager = require('../datamanagers/ProductManager.js')

const cm = new CartsManager('./assets/corritos.json')
const pm = new ProductManager('./assets/productos.json')

const router = Router()

router.post('/', async (_, res) => {
    try {
        const newCart = await cm.addCart({ products: [] })
        res.status(201).json(newCart)
    } catch (error) {
        res.status(404).json({ message: error.message })
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
    const { cid, pid } = req.params

    try {
        const cart = await cm.getCartById(cid)
        // verifica que exista el producto, si no existe lanza un error
        await pm.getProductById(pid)

        const productCart = cart.products.find(e => e.product == pid)
        if (productCart) {
            productCart.quantity++
        } else {
            const newProductCart = { product: parseInt(pid), quantity: 1 }
            cart.products.push(newProductCart)
        }

        const updatedCart = await cm.updateCart(cid, cart)

        res.json(updatedCart)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

module.exports = router
