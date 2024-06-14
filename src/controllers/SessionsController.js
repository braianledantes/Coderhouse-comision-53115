const passport = require('passport')
const { CustomError } = require('../errors/CustomError')

class SessionsController {
    constructor({ usersService }) {
        this.usersService = usersService
    }

    login = [
        passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }),
        async (req, res) => {
            try {
                // crear nueva sesión si el usuario existe
                req.session.user = { email: req.user.email, role: req.user.role }

                res.redirect('/products')
            } catch (error) {
                throw new  CustomError({
                    name: 'RequestError',
                    message: 'Error en login',
                    code: ERROR_CODES.AUTHENTICATION_FAILED,
                    cause: error
                })
            }
        }
    ]

    faillogin = (_, res) => {
        res.send('Login failed!')
    }

    logout = (req, res) => {
        req.session.destroy(err => {
            if (!err) {
                return res.redirect('/')
            }

            throw new  CustomError({
                name: 'RequestError',
                message: 'Error logging out',
                code: ERROR_CODES.AUTHENTICATION_FAILED,
                cause: err
            })
        })
    }

    register = [
        passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }),
        (_, res) => {
            res.redirect('/')
        }
    ]

    failRegister = (_, res) => {
        res.send('Error registering user!')
    }

    authenticateWithGithub = [
        passport.authenticate('github', { scope: ['user:email'] }),
        (req, res) => { }
    ]

    githubCallback = [
        passport.authenticate('github', { failureRedirect: '/' }),
        (req, res) => {
            // crear nueva sesión si el usuario existe
            req.session.user = { email: req.user.email, role: req.user.role }
            res.redirect('/products')
        }
    ]

    getCurrentUser = async (req, res) => {
        const emailFromSession = req.session.user?.email

        if (!emailFromSession) {
            throw new  CustomError({
                name: 'RequestError',
                message: 'User not logged in',
                code: ERROR_CODES.AUTHENTICATION_FAILED
            })
        }

        const user = await this.usersService.getUserByEmail({ email: emailFromSession })
        return res.json(user)
    }
}

module.exports = SessionsController