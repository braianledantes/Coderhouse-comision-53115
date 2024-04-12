const z = require('zod')

const putCartSchema = z.object({
    products: z.array(
        z.object({
            product: z.string(),
            quantity: z.number().int().positive()
        })
    )
})

function validateUpdateCart(req, res, next) {
    const result = putCartSchema.safeParse(req.body)
    if (result.success) {
        // cambia el contenido del body con los datos correctos
        req.body = result.data
        return next()
    }

    return res.status(400).json({ message: JSON.parse(result.error.message) })
}

module.exports = { validateUpdateCart }