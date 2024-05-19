class ChatsController {
    constructor({ chatsService }) {
        this.chatsService = chatsService
    }

    getMessages = async (_, res) => {
        try {
            const messages = await this.chatsService.getMessages()
            res.status(200)
                .json({ messages })
        } catch (error) {
            res.status(500)
                .json({ message: error.message })
        }
    
    }

    createMessage = async (req, res) => {
        try {
            const { message } = req.body
            const user = req.session.user.email
            const newMessage = await this.chatsService.createMessage({ user, message })
    
            req.app.get('websocket').emit('new-message', { message: newMessage })
    
            res.status(201)
                .json({ message: newMessage })
        } catch (error) {
            console.error(error);
            res.status(500)
                .json({ message: error.message })
        }
    }
}

module.exports = ChatsController