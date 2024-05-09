const passport = require('passport')
const { Strategy } = require('passport-github2')
const User = require('../dao/models/user.model')
const Cart = require('../dao/models/carts.model')
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

                // crea un carrito para el usuario y luego se lo asigna
                const newCart = await Cart.create({})
                if (!newCart) {
                    // error al crear carrito
                    return done(null, false)
                }

                // crear el usuario, ya que no existe
                const fullname = profile._json.name.split(' ')
                const newUser = {
                    firstName: fullname[0],
                    lastName: fullname[1],
                    age: 18,
                    email: profile._json.email,
                    password: '',
                    cart: newCart.id
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
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        done(null, user)
    })
}

module.exports = initializeStrategy