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

router.get('/current', async (req, res) => {
    try {
        const emailFromSession = req.session.user?.email

        if (!emailFromSession) {
            return res.status(401).json({ message: "User not logged in" })
        }

        const user = await userManager.getUserByEmail({ email: emailFromSession })
        // quita la password
        delete user.password
        return res.json(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
})

module.exports = router