const { Router } = require('express')
const { validateGetProducts } = require('../validations/products.validations.js')
const ProductManager = require('../dao/dbManagers/ProductManager.js')
const MessageManager = require('../dao/dbManagers/MessagesManager.js')
const CartsManager = require('../dao/dbManagers/CartsManager.js')

const pm = new ProductManager('./assets/productos.json')
const cm = new CartsManager()
const mm = new MessageManager()

const router = Router()

router.get('/home', async (req, res) => {
    const result = await pm.getProducts({ limit: 9999999 })
    const products = result.payload
    const isEmpty = products.length === 0

    res.render('home', {
        isEmpty,
        products
    })
})

router.get('/products', validateGetProducts, async (req, res) => {
    const result = await pm.getProducts(req.query)

    // crea la url
    const params = Object.keys(req.query)
        // elimina la propiedad page
        .filter(key => key != 'page')
        // quita las propiedades sin valor
        .filter(key => req.query[key] != undefined)
        // transforma las propiedades en query params
        .map(key => `${key}=${req.query[key]}`)
        .join('&')
    const url = `${req.route.path}?${params}`

    // // setea los links de navegacion
    result.prevLink = result.hasPrevPage ? `${url}&page=${result.prevPage}` : null
    result.nextLink = result.hasNextPage ? `${url}&page=${result.nextPage}` : null

    res.render('products', result)
})

router.get('/products/:pid', async (req, res) => {
    try {
        let result = await pm.getProductById(req.params.pid)

        res.render('product', result)
    } catch (error) {
        res.render('product', {})
    }

})

router.get('/realtimeproducts', async (req, res) => {
    const result = await pm.getProducts({ limit: 9999999, sort: 'desc' })
    const products = result.docs.map(p => ({
        ...p,
        thumbnail: p.thumbnail[0]
    }))
    const isEmpty = products.length === 0

    res.render('realtimeproducts', {
        isEmpty,
        products
    })
})

router.get('/chat', async (_, res) => {
    const messages = await mm.getMessages()
    res.render('chat', { messages })
})

router.get('/carts/:cid', async (req, res) => {
    const products = await cm.getCartById(req.params.cid)
    res.render('carts', products)
})

module.exports = router