const { Router } = require('express')
const { userIsLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth')
const { validateUser, validateEmailAndPasswordUser } = require('../middlewares/validations/user.validations')

const createSessionsRouter = ({ sessionsController }) => {
    const router = Router()

    router.post('/login', userIsNotLoggedIn, validateEmailAndPasswordUser, sessionsController.login)

    router.get('/faillogin', userIsNotLoggedIn, sessionsController.faillogin)

    router.get('/logout', userIsLoggedIn, sessionsController.logout)

    router.post('/register', userIsNotLoggedIn, validateUser, sessionsController.register)

    router.get('/failregister', userIsNotLoggedIn, sessionsController.failRegister)

    router.get('/github', userIsNotLoggedIn, sessionsController.authenticateWithGithub)

    router.get('/githubcallback', userIsNotLoggedIn, sessionsController.githubCallback)

    router.get('/current', userIsLoggedIn, sessionsController.getCurrentUser)

    router.get('/restore-password', userIsNotLoggedIn, sessionsController.restorePasswordRequest)
    router.post('/restore-password', userIsNotLoggedIn, sessionsController.restorePassword)

    return router
}

module.exports = createSessionsRouter