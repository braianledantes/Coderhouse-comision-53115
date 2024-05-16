class CartsController {

    constructor({ cartsService }) {
        this.cartsService = cartsService
    }

    createEmptyCart = async (_, res) => {
        try {
            const newCart = this.cartsService.createEmptyCart()
            res.status(201).json(newCart)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    getCart = async (req, res) => {
        const cid = req.params.cid
        try {
            const cart = await this.cartsService.getProductsCart(cid)
            res.json({ products: cart.products })
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    updateCartProducts = async (req, res) => {
        const cid = req.params.cid
        const newProducts = req.body.products
        try {
            const updatedCart = await this.cartsService.updateCartProducts(cid, newProducts)
            res.json(updatedCart)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    deleteCartProducts = async (req, res) => {
        const cid = req.params.cid
        try {
            const updatedCart = await this.cartsService.deleteCartProducts(cid)
            res.json(updatedCart)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    addProductToCart = async (req, res) => {
        const { cid, pid } = req.params
        try {
            const updatedCart = await this.cartsService.addProductToCart(cid, pid)
            res.json(updatedCart)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    removeProductFromCart = async (req, res) => {
        const { cid, pid } = req.params
        try {
            const updatedCart = await this.cartsService.removeProductFromCart(cid, pid)
            return res.json(updatedCart)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }
}

module.exports = CartsController