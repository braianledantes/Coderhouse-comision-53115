class CartsController {

    constructor({ usersService, cartsService }) {
        this.cartsService = cartsService
        this.usersService = usersService
    }

    createEmptyCart = async (_, res) => {
        const newCart = this.cartsService.createEmptyCart()
        res.status(201).json(newCart)
    }

    getCart = async (req, res) => {
        const cid = req.params.cid
        const cart = await this.cartsService.getCartById(cid)
        res.json({ products: cart.products })
    }

    updateCartProducts = async (req, res) => {
        const cid = req.params.cid
        const newProducts = req.body.products
        const updatedCart = await this.cartsService.updateCartProducts(cid, newProducts)
        res.json(updatedCart)
    }

    deleteCartProducts = async (req, res) => {
        const cid = req.params.cid
        const updatedCart = await this.cartsService.deleteCartProducts(cid)
        res.json(updatedCart)
    }

    addProductToCart = async (req, res) => {
        const { cid, pid } = req.params
        const updatedCart = await this.cartsService.addProductToCart(cid, pid)
        res.json(updatedCart)
    }

    removeProductFromCart = async (req, res) => {
        const { cid, pid } = req.params
        const updatedCart = await this.cartsService.removeProductFromCart(cid, pid)
        return res.json(updatedCart)
    }

    // Ticket methods ----------------------
    createTicket = async (req, res) => {
        const { cid } = req.params
        const ticket = await this.cartsService.createTicket(cid)
        res.json(ticket)
    }

    // Current cart methods ----------------------

    getCurrentCart = async (req, res) => {
        const emailFromSession = req.session.user.email
        const user = (await this.usersService.getUserByEmail({ email: emailFromSession }))
        const cart = user.cart
        res.json({ products: cart.products })
    }

    updateCurrentCartProducts = async (req, res) => {
        const emailFromSession = req.session.user.email
        const user = (await this.usersService.getUserByEmail({ email: emailFromSession }))

        const cid = user.cart.id
        const newProducts = req.body.products

        const updatedCart = await this.cartsService.updateCartProducts(cid, newProducts)
        res.json(updatedCart)
    }

    deleteCurrentCartProducts = async (req, res) => {
        const emailFromSession = req.session.user.email
        const user = await this.usersService.getUserByEmail({ email: emailFromSession })

        const cid = user.cart.id

        const updatedCart = await this.cartsService.deleteCartProducts(cid)
        res.json(updatedCart)
    }

    addProductToCurrentCart = async (req, res) => {
        const { pid } = req.params
        const emailFromSession = req.session.user.email
        const user = await this.usersService.getUserByEmail({ email: emailFromSession })

        const cid = user.cart.id

        const updatedCart = await this.cartsService.addProductToCart(cid, pid)
        res.json(updatedCart)
    }

    removeProductFromCurrentCart = async (req, res) => {
        const { pid } = req.params
        const emailFromSession = req.session.user.email
        const user = await this.usersService.getUserByEmail({ email: emailFromSession })

        const cid = user.cart.id

        const updatedCart = await this.cartsService.removeProductFromCart(cid, pid)
        return res.json(updatedCart)
    }
}

module.exports = CartsController