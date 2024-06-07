const z = require('zod')
const ERROR_CODES = require('../../errors/errorCodes')
const { CustomError } = require('../../errors/CustomError')

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

    throw new CustomError({
        name: 'ValidationError',
        message: "Invalid input to update cart",
        cause: result.error.errors,
        code: ERROR_CODES.INVALID_INPUT
    })
}

module.exports = { validateUpdateCart }