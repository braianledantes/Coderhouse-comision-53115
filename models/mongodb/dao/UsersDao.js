const UserModel = require("../models/user")

class UserDao {

    async getUserById({ id }) {
        return UserModel.findById(id)
    }

    async getUserByEmailAndPassword({ email, password }) {
        return UserModel.findOne({ email, password })
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
        UserModel.create({
            firstName,
            lastName,
            age: +age,
            email,
            password,
            cart
        })
    }
}

module.exports = UserDao