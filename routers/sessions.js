const { Router } = require('express')

const { validateUser, validateEmailAndPasswordUser } = require('../middlewares/validations/user.validations')

const createSessionsRouter = ({ sessionsController }) => {
    const router = Router()

    router.post('/login', validateEmailAndPasswordUser, sessionsController.login)
    
    router.get('faillogin', sessionsController.faillogin)
    
    router.get('/logout', sessionsController.logout)
    
    router.post('/register', validateUser, sessionsController.register)
    
    router.get('failregister', sessionsController.failRegister)
    
    router.get('/github', sessionsController.authenticateWithGithub)
    
    router.get('/githubcallback', sessionsController.githubCallback)
    
    router.get('/current', sessionsController.getCurrentUser)

    return router
}

module.exports = createSessionsRouter