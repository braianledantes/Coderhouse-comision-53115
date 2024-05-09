const { Router } = require('express')
const { validateGetProducts } = require('../validations/products.validations')
const { userIsLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware')
const ProductManager = require('../dao/dbManagers/ProductManager')
const MessageManager = require('../dao/dbManagers/MessagesManager')
const CartsManager = require('../dao/dbManagers/CartsManager')
const UsersManager = require('../dao/dbManagers/UsersManager')
const admin = require('../config/admin')

const pm = new ProductManager('./assets/productos.json')
const cm = new CartsManager()
const mm = new MessageManager()
const um = new UsersManager()

const router = Router()

router.get('/', (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user)

    res.render('index', {
        title: 'Home',
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn,
    })
})

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
    const emailFromSession = req.session.user.email

    let user
    if (admin.isAdmin(emailFromSession)) {
        user = admin.userAdmin
    } else {
        user = await um.getUserByEmail({ email: emailFromSession })
    }

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

    res.render('products', {
        title: 'Productos',
        ...result,
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email
        }
    })
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
    const products = result.payload
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
    try {
        const result = await cm.getCartById(req.params.cid)
        result.products = result.products.filter(i => i && i.product)
        return res.render('carts', result)
    } catch (error) {
        return res.render('carts', [])
    }
})

router.get('/login', userIsNotLoggedIn, (req, res) => {
    res.render('login', {
        title: 'Iniciar Sesión'
    })
})

router.get('/register', userIsNotLoggedIn, (req, res) => {
    res.render('register', {
        title: 'Registrarse'
    })
})

router.get('/profile', userIsLoggedIn, async (req, res) => {
    const emailFromSession = req.session.user.email

    let user
    if (admin.isAdmin(emailFromSession)) {
        user = admin.userAdmin
    } else {
        user = await um.getUserByEmail({ email: emailFromSession })
    }

    res.render('profile', {
        title: 'Mi Perfil',
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email
        }
    })
})
module.exports = router