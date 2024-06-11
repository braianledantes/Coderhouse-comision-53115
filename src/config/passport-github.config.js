const passport = require('passport')
const { Strategy } = require('passport-github2')
const { clientID, clientSecret, callbackURL } = require('./github.private')
const CreateUserDto = require('../dtos/CreateUserDto')

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
                    console.error(error);
                    // no se encontro el usuario, todo bien
                }

                // crear usuario
                const fullname = profile._json.name.split(' ')

                const createUserDto = new CreateUserDto(fullname[0], fullname[1], 18, profile._json.email, '')
                const userDto = await usersService.createUser(createUserDto)
                // usuario nuevo creado exitosamente
                done(null, userDto)
            }
            catch (err) {
                // error inesperado!
                done(err)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await usersService.getUserById({ id })
        done(null, user)
    })
}

module.exports = initializeStrategy