const { UserModel } = require("../models/UserModel")
const UserDto = require("../../../dtos/UserDto")
const UserWithCartDto = require("../../../dtos/UserWithCartDto")
const admin = require("../../../config/admin")
const { CustomError } = require("../../../errors/CustomError")
const ERROR_CODES = require("../../../errors/errorCodes")

class UserDao {

    #mapUserToUserDto(user) {
        if (!user) throw new CustomError({
            name: 'UserNotFound',
            message: 'User not found',
            code: ERROR_CODES.INVALID_INPUT
        })

        const userDto = new UserDto({
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email,
            role: user.role,
            cart: user.cart._id.toString(),
        })

        return userDto;
    }

    #mapUserToUserWithCartDto(user) {
        if (!user) throw new CustomError({
            name: 'UserNotFound',
            message: 'User not found',
            code: ERROR_CODES.INVALID_INPUT
        })

        const cart = {
            id: user.cart._id.toString(),
            products: user.cart?.products?.map(item => ({
                product: item.product.toString(),
                quantity: item.quantity
            }))
        }

        const userDto = new UserWithCartDto({
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email,
            role: user.role,
            cart: cart,
        })

        return userDto;
    }

    async getUserById({ id }) {
        if (admin.isAdmin(id)) {
            return this.#mapUserToUserDto(admin.userAdmin)
        }

        const user = await UserModel.findById(id)
        return this.#mapUserToUserDto(user)
    }

    async getUserByEmail({ email }) {
        try {

            if (admin.isAdmin(email)) {
                return this.#mapUserToUserDto(admin.userAdmin)
            }

            const user = await UserModel.findOne({ email })
                .populate('cart')
            return this.#mapUserToUserWithCartDto(user)
        } catch (error) {
            throw new CustomError({
                name: 'UserNotFound',
                message: `User with email ${email} not found`,
                code: ERROR_CODES.INVALID_INPUT
            })
        }
    }

    async getUserByCartId(cartId) {
        try {
            const user = await UserModel.findOne({ cart: cartId })
            return this.#mapUserToUserDto(user)
        } catch (error) {
            throw new CustomError({
                name: 'UserNotFound',
                message: `User with cartId ${cartId} not found`,
                code: ERROR_CODES.INVALID_INPUT
            })
        }
    }

    async getUserPassword({ email }) {
        try {
            if (admin.isAdmin(email)) {
                return admin.userAdmin.password
            }

            const user = await UserModel.findOne({ email })
            return user.password
        } catch (error) {
            throw new CustomError({
                name: 'UserNotFound',
                message: `User with email ${email} not found`,
                code: ERROR_CODES.INVALID_INPUT
            })
        }

    }

    async createNewUser({ firstName, lastName, age, email, password, cart }) {
        const user = await UserModel.create({
            firstName,
            lastName,
            age: +age,
            email,
            password,
            cart
        })
        return this.#mapUserToUserDto(user)
    }

    async updateUserPassword({ email, password }) {
        await UserModel.findOneAndUpdate({ email }, { password })
        return true
    }

    async updateUserRole({ id, role }) {
        const user = await UserModel.findOneAndUpdate({ _id: id }, { role }, { new: true })
        return this.#mapUserToUserDto(user)
    }

    async getAllUsers() {
        const users = await UserModel.find()
        return users.map(user => this.#mapUserToUserDto(user))
    }

    async deleteUserById({ id }) {
        await UserModel.findByIdAndDelete(id)
        return true
    }

    async updateLastConnection({ id, lastConnection }) {
        const userUpdated = await UserModel.findOneAndUpdate(
            { _id: id },
            { lastConnection },
            { new: true }
        )
        return userUpdated
    }

    /**
     * Obtiene los usuarios que no se han conectado desde la fecha pasada como parámetro.
     */
    async getUsersByLastConnection({ lastConnection }) {
        const users = await UserModel.find({ lastConnection: { $lt: lastConnection } })
        return users.map(user => this.#mapUserToUserDto(user))
    }

    /**
     * Elimina los usuarios que no se han conectado desde la fecha pasada como parámetro.
     */
    async deleteInactiveUsers({ lastConnection }) {
        await UserModel.deleteMany({ lastConnection: { $lt: lastConnection } })
        return true
    }

}

module.exports = UserDao