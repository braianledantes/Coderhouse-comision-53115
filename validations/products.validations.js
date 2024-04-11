const { query, validationResult, matchedData } = require('express-validator')
const z = require('zod')

validateGetProducts = [
    query('limit')
        .default(10)
        .isInt({ min: 1 }),
    query('page')
        .default(1)
        .isInt({ min: 1 }),
    query('query')
        .default('')
        .isString()
        .escape(),
    query('sort')
        .default(undefined)
        .isIn([undefined, 'asc', 'desc']),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            req.query = matchedData(req)
            next()
        } catch (error) {
            res.status(400)
            res.send({ errors: error.array() })
        }
    }
]

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

function validateNewProduct(req, res, next) {
    const result = productSchema.partial().safeParse(req.body)
    if (result.success) {
        return next()
    }

    return res.status(400).json({ message: JSON.parse(result.error.message) })
}

function validateUpdateProduct(req, res, next) {
    const result = productSchema.safeParse(req.body)
    if (result.success) {
        return next()
    }

    return res.status(400).json({ message: JSON.parse(result.error.message) })
}

module.exports = { validateGetProducts, validateNewProduct, validateUpdateProduct }