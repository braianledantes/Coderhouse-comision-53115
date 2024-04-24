const { Router } = require('express')
const { validateUser, validateEmailAndPasswordUser } = require('../validations/user.validations')
const UsersManager = require('../dao/dbManagers/UsersManager')
const admin = require('../admin')

const userManager = new UsersManager()

const router = Router()

router.post('/login', validateEmailAndPasswordUser, async (req, res) => {
    try {
        const { email, password } = req.body

        // verifica que el usuario sea admin
        if (admin.validateLogin(email, password)) {
            // rol de admin
            req.session.role = "admin"
        } else {
            // verificar que el usuario exista en la BD
            const user = await userManager.getUserByEmailAndPassword({ email, password })
            if (!user) {
                return res.status(400).json({ error: 'User not found!' })
            }
            // rol de user
            req.session.role = "user"
        }

        // 2. crear nueva sesión si el usuario existe
        req.session.user = { email }

        res.redirect('/products')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            return res.redirect('/')
        }

        return res.status(500).json({ error: err })
    })
})

router.post('/register', validateUser, (req, res) => {
    console.log("register", req.body);
    try {
        const { firstName, lastName, age, email, password } = req.body

        userManager.createNewUser({
            firstName,
            lastName,
            age: +age,
            email,
            password
        })

        res.redirect('/')

    } catch (error) {
        return res.status(500).json({ error })
    }
})

module.exports = router