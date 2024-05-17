const admin = require('../config/admin')

class ViewsController {
    constructor({ cartsService, chatsService, productsService, usersService }) {
        this.cartsService = cartsService
        this.chatsService = chatsService
        this.productsService = productsService
        this.usersService = usersService
    }

    index = (req, res) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)

        res.render('index', {
            title: 'Home',
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn,
            layout: isLoggedIn ? 'main-user-logged-in' : 'main'
        })
    }

    home = async (req, res) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)

        const products = await this.productsService.getProducts({})
        const isEmpty = products.length === 0

        res.render('home', {
            isEmpty,
            products,
            layout: isLoggedIn ? 'main-user-logged-in' : 'main'
        })
    }

    paginationProducts = async (req, res) => {
        const emailFromSession = req.session.user.email

        let user
        if (admin.isAdmin(emailFromSession)) {
            user = admin.userAdmin
        } else {
            user = await this.usersService.getUserByEmail({ email: emailFromSession })
        }

        const pagination = await this.productsService.getPaginationProducts({
            baseUrl: req.baseUrl,
            params: req.query
        })

        res.render('products', {
            title: 'Productos',
            ...pagination,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                email: user.email
            },
            layout: 'main-user-logged-in'
        })
    }

    getProduct = async (req, res) => {
        try {
            let { product } = await this.productsService.getProduct({ productId: req.params.pid })

            res.render('product', { product, layout: 'main-user-logged-in' })
        } catch (error) {
            res.render('product', { layout: 'main-user-logged-in' })
        }
    }

    realtimeproducts = async (_, res) => {
        const products = await this.productsService.getProducts({ sort: 'desc' })
        const isEmpty = products.length === 0

        res.render('realtimeproducts', {
            isEmpty,
            products,
            layout: 'main-user-logged-in'
        })
    }

    chat = async (_, res) => {
        const messages = await this.chatsService.getMessages()
        res.render('chat', { messages, layout: 'main-user-logged-in' })
    }

    cart = async (req, res) => {
        try {
            const result = await this.cartsService.getCartById(req.params.cid)
            result.products = result.products.filter(i => i && i.product)
            return res.render('carts', { ...result, layout: 'main-user-logged-in' })
        } catch (error) {
            return res.render('carts', { layout: 'main-user-logged-in'})
        }
    }

    login = (_, res) => {
        res.render('login', {
            title: 'Iniciar Sesión'
        })
    }

    register = (_, res) => {
        res.render('register', {
            title: 'Registrarse'
        })
    }

    profile = async (req, res) => {
        const emailFromSession = req.session.user.email

        let user
        if (admin.isAdmin(emailFromSession)) {
            user = admin.userAdmin
        } else {
            user = await this.usersService.getUserByEmail({ email: emailFromSession })
        }

        res.render('profile', {
            title: 'Mi Perfil',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                email: user.email
            },
            layout: 'main-user-logged-in'
        })
    }
}

module.exports = ViewsController