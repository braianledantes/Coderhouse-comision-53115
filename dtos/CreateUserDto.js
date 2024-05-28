class CreateUserDto {
    constructor(firstName, lastName, age, email, password) {
        this.firstName = firstName
        this.lastName = lastName
        this.age = age
        this.email = email
        this.password = password
    }
}

module.exports = CreateUserDto