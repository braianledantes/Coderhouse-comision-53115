const hashingUtils = require('../utils/hashing')

class UsersService {
    constructor({ usersDao, cartsDao }) {
        this.usersDao = usersDao
        this.cartsDao = cartsDao
    }

    getUserIfIsValid = async ({ email, password }) => {
        const user = await this.usersDao.getUserByEmail({ email })

        if (user && hashingUtils.isValidPassword(password, user.password)) {
            return user
        }

        return undefined
    }

    getUserById = async ({ id }) => {
        const user = await this.usersDao.getUserById({ id })
        // quita la password
        delete user.password
        return user
    }

    getUserByEmail = async ({ email }) => {
        const user = await this.usersDao.getUserByEmail({ email })
        // quita la password
        delete user.password
        return user
    }

    createUser = async ({ user }) => {
        const newCart = await this.cartsDao.addCart({ products: [] })
        if (!newCart) {
            throw new Error('Error creating cart')
        }
        // se hashea la password
        user.password = hashingUtils.hashPassword(user.password)
        // se asigna el carrito al usuario
        user.cart = newCart.id
        const newUser = await this.usersDao.createNewUser(user)
        // se quita la password
        delete newUser.password
        return newUser
    }
}

module.exports = UsersService