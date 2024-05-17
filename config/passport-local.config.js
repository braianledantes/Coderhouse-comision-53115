const passport = require('passport')
const { Strategy } = require('passport-local')

const initializeStrategy = ({ usersService }) => {

    passport.use('register', new Strategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const { firstName, lastName, age, email } = req.body

        try {
            try {
                const user = await usersService.getUserByEmail({ email: username })
                if (user) {
                    // error, usuario con ese email ya existe
                    return done(null, false)
                }
            } catch (err) {
                // no se encontro el usuario, todo bien
            }

            const newUser = {
                firstName,
                lastName,
                age: +age,
                email,
                password
            }
            const result = await usersService.createUser({ user: newUser })

            // usuario nuevo creado exitosamente
            return done(null, result)
        } catch (err) {

            // error inesperado!
            done(err)
        }
    }))

    passport.use('login', new Strategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {

            if (!username || !password) {
                return done(null, false)
            }

            const user = await usersService.getUserIfIsValid({ email: username, password })
            if (!user) {
                return done(null, false)
            }

            return done(null, user)
        } catch (err) {
            done(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await usersService.getUserById({ id })
        done(null, user)
    })
}

module.exports = initializeStrategy