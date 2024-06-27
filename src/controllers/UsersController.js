const { CustomError } = require('../errors/CustomError')

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
}

module.exports = UsersController