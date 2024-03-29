const { Router } = require('express')
const MessageManager = require('../dao/dbManagers/MessagesManager')

const router = Router()

const mm = new MessageManager()

router.get('/', async (_, res) => {
    try {
        const messages = await mm.getMessages()
        res.status(200)
            .json({ messages })
    } catch (error) {
        res.status(500)
            .json({ message: error.message })
    }

})

router.post('/', async (req, res) => {
    const { user, message } = req.body

    try {
        const newMessage = await mm.addMessage({ user, message })

        req.app.get('websocket').emit('new-message', { message: newMessage })

        res.status(201)
            .json({ message: newMessage })
    } catch (error) {
        console.error(error);
        res.status(500)
            .json({ message: error.message })
    }

})

module.exports = router
