const passport = require('passport')
const { Strategy } = require('passport-github2')
const { clientID, clientSecret, callbackURL } = require('./github.private')

const initializeStrategy = ({ usersService }) => {

    passport.use('github', new Strategy(
        {
            clientID,
            clientSecret,
            callbackURL
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                try {
                    // buscar usuario por email
                    const user = await usersService.getUserByEmail({ email: profile._json.email })
                    // usuario encontrado, todo bien
                    return done(null, user)
                } catch (error) {
                    // no se encontro el usuario, todo bien
                }

                // crear usuario
                const fullname = profile._json.name.split(' ')
                const newUser = {
                    firstName: fullname[0],
                    lastName: fullname[1],
                    age: 18,
                    email: profile._json.email,
                    password: ''
                }
                const result = await usersService.createUser({ user: newUser })
                // usuario nuevo creado exitosamente
                done(null, result)
            }
            catch (err) {
                // error inesperado!
                done(err)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await usersService.getUserById({ id })
        done(null, user)
    })
}

module.exports = initializeStrategy