const { CustomError } = require('../errors/CustomError')
const ERROR_CODES = require('../errors/errorCodes')

class UsersController {
    constructor({ usersService }) {
        this.usersService = usersService
    }

    // cambia el rol de un usuario de user a premium y viceversa
    changeUserRole = async (req, res) => {
        try {
            const { uid } = req.params
            const user = await this.usersService.changeUserRole(uid)
            res.json(user)
        } catch (error) {
            throw new CustomError({
                name: 'RequestError',
                message: 'Error changing user role',
                code: ERROR_CODES.INVALID_INPUT,
                cause: error
            })
        }
    }

    getAllUsers = async (_req, res) => {
        try {
            const users = await this.usersService.getAllUsers()
            res.json(users)
        } catch (error) {
            throw new CustomError({
                name: 'RequestError',
                message: 'Error getting all users',
                code: ERROR_CODES.INVALID_INPUT,
                cause: error
            })
        }
    }

    deleteUserById = async (req, res) => {
        try {
            const { uid } = req.params
            const userDeleted = await this.usersService.deleteUserById({ id: uid })
            res.json({ message: 'User deleted', user: userDeleted })
        } catch (error) {
            throw new CustomError({
                name: 'RequestError',
                message: 'Error deleting user',
                code: ERROR_CODES.INVALID_INPUT,
                cause: error
            })
        }
    }

    deleteInactiveUsers = async (_req, res) => {
        try {
            const cantUsersDeleted = await this.usersService.deleteInactiveUsers()
            res.json({ message: `${cantUsersDeleted} users deleted` })
        } catch (error) {
            console.log(error)
            throw new CustomError({
                name: 'RequestError',
                message: 'Error deleting inactive users',
                code: ERROR_CODES.INVALID_INPUT,
                cause: error
            })
        }
    }
}

module.exports = UsersController