const z = require('zod')

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
    
        return res.status(400).json({ message: JSON.parse(result.error.message) })
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
    
        return res.status(400).json({ message: JSON.parse(result.error.message) })
    }
 }