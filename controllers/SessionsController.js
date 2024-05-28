const passport = require('passport')

class SessionsController {
    constructor({ usersService }) {
        this.usersService = usersService
    }

    login = [
        passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }),
        async (req, res) => {
            try {
                // crear nueva sesión si el usuario existe
                req.session.user = { email: req.user.email, id: req.user.id }

                res.redirect('/products')
            } catch (error) {
                console.error(error);
                res.status(500).json({ error })
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

            return res.status(500).json({ error: err })
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
            req.session.user = { email: req.user.email }
            res.redirect('/products')
        }
    ]

    getCurrentUser = async (req, res) => {
        try {
            const emailFromSession = req.session.user?.email
    
            if (!emailFromSession) {
                return res.status(401).json({ message: "User not logged in" })
            }
    
            const user = await this.usersService.getUserByEmail({ email: emailFromSession })
            return res.json(user)
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = SessionsController