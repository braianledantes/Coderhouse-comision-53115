const UserModel = require("../models/user.model")

class UserManager {

    async getUserByEmailAndPassword({ email, password }) {
        return UserModel.findOne({ email, password })
    }

    async getUserByEmail({ email }) {
        return UserModel.findOne({ email })
    }

    async createNewUser({ firstName, lastName, age, email, password }) {
        UserModel.create({
            firstName,
            lastName,
            age: +age,
            email,
            password
        })
    }
}

module.exports = UserManager