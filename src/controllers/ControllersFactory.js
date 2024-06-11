const CartsController = require('./CartsController')
const ChatsController = require('./ChatsController')
const ProductsController = require('./ProductsController')
const SessionsController = require('./SessionsController')
const ViewsController = require('./ViewsController')

class ControllersFactory {
    constructor({ servicesFactory }) {
        this.servicesFactory = servicesFactory
    }

    createCartsController() {
        return new CartsController({
            usersService: this.servicesFactory.getUsersServiceInstance(),
            cartsService: this.servicesFactory.getCartsServiceInstance()
        })
    }

    createChatsController() {
        return new ChatsController({ chatsService: this.servicesFactory.getChatsServiceInstance() })
    }

    createProductsController() {
        return new ProductsController({ productsService: this.servicesFactory.getProductsServiceInstance() })
    }

    createSessionsController() {
        return new SessionsController({ usersService: this.servicesFactory.getUsersServiceInstance() })
    }

    createViewsController() {
        return new ViewsController({
            cartsService: this.servicesFactory.getCartsServiceInstance(),
            chatsService: this.servicesFactory.getChatsServiceInstance(),
            productsService: this.servicesFactory.getProductsServiceInstance(),
            usersService: this.servicesFactory.getUsersServiceInstance()
        })
    }
}

module.exports = ControllersFactory