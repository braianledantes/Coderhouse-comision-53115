const { Router } = require('express')
const CartsManager = require('../dao/dbManagers/CartsManager.js')
const ProductManager = require('../dao/dbManagers/ProductManager.js')
const { validateUpdateCart } = require('../validations/carts.validations.js')

const cm = new CartsManager('./assets/corritos.json')
const pm = new ProductManager('./assets/productos.json')

const router = Router()

/**
 * Crea un carrito vacio. Devuelve el carrito.
 */
router.post('/', async (_, res) => {
    try {
        const newCart = await cm.addCart({ products: [] })
        res.status(201).json(newCart)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

/**
 * Dado un id de un carrito se obtienen los productos del mismo.
 */
router.get('/:cid', async (req, res) => {
    const cid = req.params.cid

    try {
        const cart = await cm.getCartById(cid)
        res.json({ products: cart.products })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

/**
 * Actualizar el carrito con un arreglo de productos.
 */
router.put('/:cid', validateUpdateCart, async (req, res) => {
    const cid = req.params.cid
    const newProducts = req.body.products

    try {
        const cart = await cm.getCartById(cid)
        cart.products = newProducts

        const updatedCart = await cm.updateCart(cid, cart)

        res.json(updatedCart)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

/**
 * Eliminar todos los produtos de un carrito.
 */
router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid
    try {
        const cart = await cm.getCartById(cid)
        cart.products = []

        const updatedCart = await cm.updateCart(cid, cart)

        res.json(updatedCart)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

/**
 * Agrega un producto a un carrito, si el producto ya está en el carrito se suma la cantidad.
 */
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params

    try {
        const cart = await cm.getCartById(cid)
        // verifica que exista el producto, si no existe lanza un error
        await pm.getProductById(pid)

        const productCart = cart.products.find(e => e.product.id == pid)
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

/**
 * Elimina del carrito el producto seleccionado.
 */
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params

    try {
        const cart = await cm.getCartById(cid)
        // verifica que exista el producto, si no existe lanza un error
        await pm.getProductById(pid)

        const pIndex = cart.products.findIndex(e => e.product.id == pid)
        if (pIndex != -1) {
            cart.products.splice(pIndex, 1)
            const updatedCart = await cm.updateCart(cid, cart)

            return res.json(updatedCart)
        }
        return res.status(404).json({message: `Product with id ${pid} not found in this cart ${cid}`})

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

module.exports = router
