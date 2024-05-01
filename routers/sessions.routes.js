const { Router } = require('express')
const passport = require('passport')
const { validateUser, validateEmailAndPasswordUser } = require('../validations/user.validations')
const UsersManager = require('../dao/dbManagers/UsersManager')
const admin = require('../config/admin')

const userManager = new UsersManager()

const router = Router()

router.post('/login', validateEmailAndPasswordUser,
    passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }),
    async (req, res) => {
        try {
            const { email, password } = req.body

            // verifica que el usuario sea admin
            if (admin.validateLogin(email, password)) {
                // rol de admin
                req.session.role = "admin"
            } else {
                // rol de user
                req.session.role = "user"
            }

            // crear nueva sesión si el usuario existe
            req.session.user = { email: req.user.email, _id: req.user._id }

            res.redirect('/products')
        } catch (error) {
            console.error(error);
            res.status(500).json({ error })
        }
    })

router.get('faillogin', (_, res) => {
    res.send('Login failed!')
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            return res.redirect('/')
        }

        return res.status(500).json({ error: err })
    })
})

router.post('/register', validateUser,
    passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }),
    (_, res) => {
        res.redirect('/')
    })

router.get('failregister', (_, res) => {
    res.send('Error registering user!')
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => { })

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    req.session.user = { email: req.user.email }
    res.redirect('/products')
})

module.exports = router