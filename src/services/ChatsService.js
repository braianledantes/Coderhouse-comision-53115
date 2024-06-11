class ChatsService {
    constructor({ messagesDao }) {
        this.messagesDao = messagesDao
    }

    getMessages = async () => {
        const messages = await this.messagesDao.getMessages()
        return messages
    }

    createMessage = async ({ user, message }) => {
        const newMessage = await this.messagesDao.addMessage({ user, message }) 
        return newMessage
    }
}

module.exports = ChatsService