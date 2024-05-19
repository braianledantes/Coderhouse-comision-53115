const UserModel = require("../schemas/user")

class UserDao {

    async getUserById({ id }) {
        const user = await UserModel.findById(id)
        return user.toJSON()
    }

    async getUserByEmailAndPassword({ email, password }) {
        const user = await UserModel.findOne({ email, password })
        return user.toJSON()
    }

    async getUserByEmail({ email }) {
        try {
            const user = await UserModel.findOne({ email })
                .populate('cart')
            return user.toJSON()
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
        return user.toJSON()
    }
}

module.exports = UserDao