const passport = require('passport')
const { Strategy } = require('passport-github2')
const User = require('../dao/models/user.model')
const { clientID, clientSecret, callbackURL } = require('./github.private')

const initializeStrategy = () => {

    passport.use('github', new Strategy(
        {
            clientID,
            clientSecret,
            callbackURL
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ email: profile._json.email })
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
                const result = await User.create(newUser)
                done(null, result)
            }
            catch (err) {
                done(err)
            }
        }
    ))


    passport.serializeUser((user, done) => {
        console.log('serialized!', user)
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        console.log('deserialized!', id, user)
        done(null, user)
    })
}

module.exports = initializeStrategy