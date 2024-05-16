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
                const user = await usersService.getUserByEmail({ email: profile._json.email })
                if (user) {
                    return done(null, user)
                }

                // crear el usuario, ya que no existe
                const fullname = profile._json.name.split(' ')
                const newUser = {
                    firstName: fullname[0],
                    lastName: fullname[1],
                    age: 18,
                    email: profile._json.email,
                    password: ''
                }
                const result = await usersService.createUser({ user: newUser })
                done(null, result)
            }
            catch (err) {
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