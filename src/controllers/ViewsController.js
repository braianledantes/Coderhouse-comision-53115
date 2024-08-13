const admin = require('../config/admin')
const { ROLES } = require('../data/userRoles')

class ViewsController {
    constructor({ cartsService, chatsService, productsService, usersService }) {
        this.cartsService = cartsService
        this.chatsService = chatsService
        this.productsService = productsService
        this.usersService = usersService
    }

    #isAdmin = (req) => {
        return req?.session?.user?.role === ROLES.ADMIN
    }

    index = (req, res) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        const isAdmin = this.#isAdmin(req)

        res.render('index', {
            title: 'Home',
            isAdmin,
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn,
            layout: isLoggedIn ? 'main-user-logged-in' : 'main'
        })
    }

    home = async (req, res) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        const isAdmin = this.#isAdmin(req)

        const products = await this.productsService.getProducts({})
        const isEmpty = products.length === 0

        res.render('home', {
            isAdmin,
            isEmpty,
            products,
            layout: isLoggedIn ? 'main-user-logged-in' : 'main'
        })
    }

    paginationProducts = async (req, res) => {
        const emailFromSession = req.session.user.email
        const isAdmin = this.#isAdmin(req)

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
            isAdmin,
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
        const isAdmin = this.#isAdmin(req)
        try {
            const { product } = await this.productsService.getProduct({ productId: req.params.pid })
            res.render('product', { isAdmin, ...product, layout: 'main-user-logged-in' })
        } catch (error) {
            res.render('product', { isAdmin, layout: 'main-user-logged-in' })
        }
    }

    realtimeproducts = async (req, res) => {
        const isAdmin = this.#isAdmin(req)

        const products = await this.productsService.getProducts({ sort: 'desc' })
        const isEmpty = products.length === 0

        res.render('realtimeproducts', {
            isAdmin,
            isEmpty,
            products,
            layout: 'main-user-logged-in'
        })
    }

    chat = async (req, res) => {
        const isAdmin = this.#isAdmin(req)

        const messages = await this.chatsService.getMessages()
        res.render('chat', { isAdmin, messages, layout: 'main-user-logged-in' })
    }

    cart = async (req, res) => {
        const isAdmin = this.#isAdmin(req)

        try {
            const emailFromSession = req.session.user.email
            const user = await this.usersService.getUserByEmail({ email: emailFromSession })
            const cart = await this.cartsService.getCartById(user.cart.id)
            
            const total = cart.products.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)

            cart.products = cart.products.filter(i => i && i.product)
            return res.render('carts', { isAdmin, ...cart, total, layout: 'main-user-logged-in' })
        } catch (error) {
            return res.render('carts', { isAdmin, layout: 'main-user-logged-in' })
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
        const isAdmin = this.#isAdmin(req)

        let user
        if (admin.isAdmin(emailFromSession)) {
            user = admin.userAdmin
        } else {
            user = await this.usersService.getUserByEmail({ email: emailFromSession })
        }

        res.render('profile', {
            title: 'Mi Perfil',
            isAdmin,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                email: user.email,
                role: user.role
            },
            layout: 'main-user-logged-in'
        })
    }

    restorepasswordrequest = (_, res) => {
        res.render('restorepasswordrequest', {
            title: 'Recuperar contraseña',
            layout: 'main'
        })
    }

    restorePassword = async (req, res) => {
        const token = req.params.token

        if (!token) {
            return res.send('Token not found')
        }

        const email = await this.usersService.validateToken({ token })

        res.render('restorepassword', {
            title: 'Recuperar contraseña',
            layout: 'main',
            token,
            email
        })
    }

    users = async (req, res) => {
        const isAdmin = this.#isAdmin(req)

        const users = await this.usersService.getAllUsers()
        const usermaped = users.map(user => ({
            ...user,
            isUser: user.role === 'user',
        }))
        res.render('users', {
            title: 'Usuarios',
            isAdmin,
            users: usermaped,
            layout: 'main-user-logged-in'
        })
    }
}

module.exports = ViewsController