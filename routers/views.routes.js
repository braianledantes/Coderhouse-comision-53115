const { Router } = require('express')
const ProductManager = require('../dao/dbManagers/ProductManager.js')
const MessageManager = require('../dao/dbManagers/MessagesManager.js')
const CartsManager = require('../dao/dbManagers/CartsManager.js')

const pm = new ProductManager('./assets/productos.json')
const cm = new CartsManager()
const mm = new MessageManager()

const router = Router()

router.get('/home', async (_, res) => {
    const productsDB = await pm.getProducts()
    const products = productsDB.map(p => ({
        ...p,
        thumbnail: p.thumbnail[0]
    }))
    const isEmpty = products.length === 0

    res.render('home', {
        isEmpty,
        products
    })
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts({})
    res.render('realtimeproducts', { products })
})

router.get('/chat', async (_, res) => {
    const messages = await mm.getMessages()
    res.render('chat', { messages })
})

router.get('/carts/:cid', async (req, res) => {
    const products = await cm.getCartById(req.params.cid)
    console.log(products);
    res.render('carts', products)
})

module.exports = router