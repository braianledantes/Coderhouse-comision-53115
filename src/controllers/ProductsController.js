class ProductsController {

    constructor({ productsService }) {
        this.productsService = productsService
    }

    getPaginationProducts = async (req, res) => {
        const pagination = await this.productsService.getPaginationProducts({
            baseUrl: req.baseUrl,
            params: req.params
        })

        res.json(pagination)
    }

    getProduct = async (req, res) => {
        const pid = req.params.pid
        const result = await this.productsService.getProduct({ productId: pid })
        res.json(result)
    }

    createProduct = async (req, res) => {
        try {
            const userEmail = req.session.user.email
            const newProduct = req.body
            const productCreated = await this.productsService.createProduct({ newProduct, userEmail })

            req.app.get('websocket').emit('product-created', { product: productCreated })

            res.status(201)
                .json({ message: "Product created", product: productCreated })
        } catch (error) {
            req.app.get('websocket').emit('product-error', { message: 'Error to create product' })
            throw error
        }
    }

    updateProduct = async (req, res) => {
        const userEmail = req.session.user.email
        const productData = req.body
        const productId = req.params.pid
        try {
            const productUpdated = await this.productsService.updateProduct({ productId, productData, userEmail })
            req.app.get('websocket').emit('product-updated', { product: productUpdated })

            res.json({ product: productUpdated })
        } catch (error) {
            req.app.get('websocket').emit('product-error', { message: 'Error to update product' })
            throw error
        }
    }

    deleteProduct = async (req, res) => {
        const pid = req.params.pid
        const userEmail = req.session.user.email
        try {
            await this.productsService.deleteProduct({ productId: pid, userEmail })

            req.app.get('websocket').emit('product-deleted', { productId: pid })

            res.json({ message: `Product ${pid} deleted` })
        } catch (error) {
            req.app.get('websocket').emit('product-error', { message: 'Error to delete product' })
            throw error
        }
    }

}

module.exports = ProductsController