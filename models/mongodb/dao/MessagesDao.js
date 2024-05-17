const MessageModel = require('../schemas/message')

const projection = { user: 1, message: 1 }

class MessageDao {

    #toMessageJson(obj) {
        const cart = obj.toJSON({ virtuals: true })
        delete cart._id
        return cart
    }

    async addMessage({ user, message }) {
        const result = await MessageModel.create({ user, message })
        const newMessage = await MessageModel.findOne({ _id: result._id }, projection)
        return this.#toMessageJson(newMessage)
    }

    async getMessages() {
        const messages = await MessageModel.find({}, projection)
        return messages.map(m => this.#toMessageJson(m))
    }
}

module.exports = MessageDao