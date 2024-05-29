const UserModel = require("../schemas/user")
const UserDto = require("../../../dtos/UserDto")
const UserWithCartDto = require("../../../dtos/UserWithCartDto")
const admin = require("../../../config/admin")

class UserDao {

    #mapUserToUserDto(user) {
        if (!user) throw new Error('User not found')

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
        if (!user) throw new Error('User not found')

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
            throw new Error(`User with email ${email} not found`)
        }
    }

    async getUserByCartId(cartId) {
        try {
            const user = await UserModel.findOne({ cart: cartId })
            return this.#mapUserToUserDto(user)
        } catch (error) {
            throw new Error(`User with cartId ${cartId} not found`)
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
            throw new Error(`User with email ${email} not found`)
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
}

module.exports = UserDao