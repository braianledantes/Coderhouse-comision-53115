class ProductsController {

    constructor({ productsService }) {
        this.productsService = productsService
    }

    getPaginationProducts = async (req, res) => {
        const pagination = this.productsService.getPaginationProducts({
            baseUrl: req.baseUrl,
            params: req.params
        })

        res.json(pagination)
    }

    getProduct = async (req, res) => {
        try {
            const pid = req.params.pid
            const result = await this.productsService.getProduct({ productId: pid })
            res.json(result)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    createProduct = async (req, res) => {
        try {
            const newProduct = req.body
            const productCreated = await this.productsService.createProduct({ newProduct })

            req.app.get('websocket').emit('product-created', { product: productCreated })

            res.status(201)
                .json({ message: "Product created", product: productCreated })
        } catch (error) {
            req.app.get('websocket').emit('product-error', { message: 'Error to create product' })
            res.status(400).json({ message: error.message })
        }
    }

    updateProduct = async (req, res) => {
        const productData = req.body
        const productId = req.params.pid
        try {
            const productUpdated = await this.productsService.updateProduct({ productId, productData })
            req.app.get('websocket').emit('product-updated', { product: productUpdated })

            res.json({ product: productUpdated })
        } catch (error) {
            req.app.get('websocket').emit('product-error', { message: 'Error to update product' })
            res.status(400).json({ message: error.message })
        }
    }

    deleteProduct = async (req, res) => {
        const pid = req.params.pid
        try {
            await this.productsService.deleteProduct({ productId: pid })

            req.app.get('websocket').emit('product-deleted', { productId: pid })

            res.json({ message: `Product ${pid} deleted` })
        } catch (error) {
            req.app.get('websocket').emit('product-error', { message: 'Error to delete product' })
            res.status(400).json({ message: error.message })
        }
    }

}

module.exports = ProductsController