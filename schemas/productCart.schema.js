const z = require('zod')

const productCartSchema = z.object({
    products: z.array(
        z.object({
            product: z.number().int().positive(),
            quantity: z.number().int().positive(),
        })
    )
})

function validateProductCart(obj) {
    return productCartSchema.safeParse(obj)
}

module.exports = { validateProductCart }
