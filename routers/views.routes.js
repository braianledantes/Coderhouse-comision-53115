const { Router } = require('express')
const ProductManager = require('../datamanagers/ProductManager.js')

const pm = new ProductManager('./assets/productos.json')

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
    const products = await pm.getProducts()
    res.render('realtimeproducts', { products })
})

module.exports = router