class UserDto {
    constructor({ id, firstName, lastName, age, email, role, cart }) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.age = age
        this.email = email
        this.role = role
        this.cart = cart
    }
}

module.exports = UserDto;