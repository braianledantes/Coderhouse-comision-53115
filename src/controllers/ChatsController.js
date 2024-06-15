class ChatsController {
    constructor({ chatsService }) {
        this.chatsService = chatsService
    }

    getMessages = async (_, res) => {
        const messages = await this.chatsService.getMessages()
        res.status(200).json({ messages })
    }

    createMessage = async (req, res) => {
        const { message } = req.body
        const user = req.session.user.email
        const newMessage = await this.chatsService.createMessage({ user, message })

        req.app.get('websocket').emit('new-message', { message: newMessage })

        res.status(201).json({ message: newMessage })
    }
}

module.exports = ChatsController