const { CustomError } = require('../errors/CustomError')
const hashingUtils = require('../utils/hashing')

class UsersService {
    constructor({ usersDao, cartsDao }) {
        this.usersDao = usersDao
        this.cartsDao = cartsDao
    }

    getUserIfIsValid = async ({ email, password }) => {
        const userPassword = await this.usersDao.getUserPassword({ email })

        if (userPassword && hashingUtils.isValidPassword(password, userPassword)) {
            const user = await this.usersDao.getUserByEmail({ email })
            return user
        }

        return undefined
    }

    getUserById = async ({ id }) => {
        const userDto = await this.usersDao.getUserById({ id })
        return userDto
    }

    getUserByEmail = async ({ email }) => {
        const userDto = await this.usersDao.getUserByEmail({ email })
        return userDto
    }

    createUser = async (createUserDto) => {
        // se crea un carrito vacio
        const newCart = await this.cartsDao.createEmptyCart()

        // se hashea la contraseña
        const hashedPassword = hashingUtils.hashPassword(createUserDto.password)

        // se crea el usuario
        const newUserDto = await this.usersDao.createNewUser({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            age: createUserDto.age,
            email: createUserDto.email,
            password: hashedPassword,
            cart: newCart.id
        })
        return newUserDto
    }
}

module.exports = UsersService