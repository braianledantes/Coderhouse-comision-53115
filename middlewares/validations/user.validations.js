const z = require('zod')
const { CustomError } = require('../../errors/CustomError')
const ERROR_CODES = require('../../errors/errorCodes')

const UserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    age: z.string(), // TODO cambiar a numero
    email: z.string().email(),
    password: z.string().min(8)
})

module.exports = { 
    validateUser: (req, res, next) => {
        const result = UserSchema.partial().safeParse(req.body)
        if (result.success) {
            // cambia el contenido del body con los datos correctos
            req.body = result.data
            return next()
        }
    
        throw new CustomError({
            name: 'ValidationError',
            message: "Invalid input to create user",
            cause: result.error.errors,
            code: ERROR_CODES.INVALID_INPUT
        })
    },
    validateEmailAndPasswordUser: (req, res, next) => {
        const schema =  z.object({
            email: z.string().email(),
            password: z.string().min(8)
        })

        const result = schema.partial().safeParse(req.body)
        if (result.success) {
            // cambia el contenido del body con los datos correctos
            req.body = result.data
            return next()
        }
    
        throw new CustomError({
            name: 'ValidationError',
            message: "Invalid input user email or password",
            cause: result.error.errors,
            code: ERROR_CODES.INVALID_INPUT
        })
    }
 }