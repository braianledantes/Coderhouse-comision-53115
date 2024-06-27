const hashingUtils = require('../utils/hashing')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { CustomError } = require('../errors/CustomError')
const ERROR_CODES = require('../errors/errorCodes')
const { ROLES } = require('../data/userRoles')

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

    sendRestorePasswordEmail = async ({ email }) => {
        const user = await this.usersDao.getUserByEmail({ email })
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: process.env.GMAIL_ACCOUNT,
                pass: process.env.GMAIL_PASSWORD
            }
        })

        transporter.sendMail({
            from: process.env.GMAIL_ACCOUNT,
            to: user.email,
            subject: 'Restore password',
            text: `Click on the following link to restore your password: http://localhost:8080/restore-password/${token}`
        })
    }

    validateToken = async ({ token }) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            return decoded.email
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new CustomError({
                    name: 'TokenExpiredError',
                    message: 'Token expired',
                    code: ERROR_CODES.PERMISSION_DENIED
                })
            } else {
                throw error
            }
        }
    }

    restorePassword = async ({ email, password1, password2 }) => {
        // se valida que las contraseñas sean iguales
        if (password1 !== password2) {
            throw new CustomError({
                name: 'PasswordsDoNotMatch',
                message: 'Passwords do not match',
                code: ERROR_CODES.INVALID_INPUT
            })
        }

        // se valida que la contraseña tenga al menos 8 caracteres
        if (password1.length < 8) {
            throw new CustomError({
                name: 'PasswordTooShort',
                message: 'Password too short',
                code: ERROR_CODES.INVALID_INPUT
            })
        }

        const userPassword = await this.usersDao.getUserPassword({ email })
        
        // si no se encuentra el usuario lanzar error
        if (!userPassword) {
            throw new CustomError({
                name: 'UserNotFound',
                message: `User with email ${email} not found`,
                code: ERROR_CODES.INVALID_INPUT
            })
        }

        // si es la misma contraseña que la anterior lanzar error
        if (hashingUtils.isValidPassword(password1, userPassword)) {
            throw new CustomError({
                name: 'SamePassword',
                message: 'New password is the same as the old one',
                code: ERROR_CODES.INVALID_INPUT
            })
        }

        // se hashea la nueva contraseña y se actualiza en la base de datos
        const hashedPassword = hashingUtils.hashPassword(password1)
        await this.usersDao.updateUserPassword({ email, password: hashedPassword })
    }

    changeUserRole = async (uid) => {
        const user = await this.usersDao.getUserById({ id: uid })
        const newRole = user.role ===  ROLES.NORMAL ? ROLES.PREMIUM : ROLES.NORMAL
        const updatedUser = await this.usersDao.updateUserRole({ id: uid, role: newRole })
        return updatedUser
    }
}

module.exports = UsersService