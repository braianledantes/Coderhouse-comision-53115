const z = require('zod')

const productSchema = z.object({
    title: z.string(),
    description: z.string(),
    code: z.string(),
    price: z.number().int().nonnegative(),
    status: z.boolean().default(true),
    stock: z.number().int().nonnegative(),
    category: z.string(),
    thumbnail: z.array(z.string().url()).optional(),
})

function validatePartialProduct(product) {
    return productSchema.partial().safeParse(product)
}

function validateProduct(product) {
    return productSchema.safeParse(product)
}

module.exports = { productSchema, validatePartialProduct, validateProduct }