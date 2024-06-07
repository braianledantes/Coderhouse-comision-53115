const { fakerES: faker } = require('@faker-js/faker');

const createRandromProduct = () => ({
    id: faker.database.mongodbObjectId(),
    code: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    thumbnail: [faker.image.url()],
    stock: faker.number.int({ min: 0, max: 200 }),
    price: parseFloat(faker.commerce.price()),
    category: faker.commerce.productAdjective(),
    status: faker.datatype.boolean()
})


const createRandromProducts = () => {
    return Array.from({ length: 50 }, (_, i) => createRandromProduct())
}

module.exports = { createRandromProduct, createRandromProducts }