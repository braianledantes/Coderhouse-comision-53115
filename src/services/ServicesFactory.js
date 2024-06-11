const CartsService = require('./CartsService')
const ChatsService = require('./ChatsService')
const ProductsService = require('./ProductsService')
const UsersService = require('./UsersService')

class ServicesFactory {
    constructor({ database }) {
        this.database = database
        this.cartsService = undefined
        this.chatsService = undefined
        this.productsService = undefined
        this.usersService = undefined
    }

    getCartsServiceInstance() {
        if (!this.cartsService) {
            this.cartsService = new CartsService({
                cartsDao: this.database.getCartsDao(),
                productsDao: this.database.getProductsDao(),
                ticketDao: this.database.getTicketDao(),
                usersDao: this.database.getUsersDao()
            })
        }
        return this.cartsService
    }

    getChatsServiceInstance() {
        if (!this.chatsService) {
            this.chatsService = new ChatsService({ messagesDao: this.database.getMessagesDao() })
        }
        return this.chatsService
    }

    getProductsServiceInstance() {
        if (!this.productsService) {
            this.productsService = new ProductsService({ productsDao: this.database.getProductsDao() })
        }
        return this.productsService
    }

    getUsersServiceInstance() {
        if (!this.usersService) {
            this.usersService = new UsersService({
                usersDao: this.database.getUsersDao(),
                cartsDao: this.database.getCartsDao()
            })
        }
        return this.usersService
    }
}

module.exports = ServicesFactory