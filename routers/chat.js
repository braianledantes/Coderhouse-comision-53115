const { Router } = require('express')

const createChatsRouter = ({ chatsController }) => {
    const router = Router()

    router.get('/', chatsController.getMessages)
    
    router.post('/', chatsController.createMessage)

    return router
}

module.exports = createChatsRouter
