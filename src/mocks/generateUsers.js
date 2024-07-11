const { fakerES: faker, fa } = require('@faker-js/faker')

const createRandromNewUser = () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 100 }) + "",
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: 'premium'
})

module.exports = { createRandromNewUser }