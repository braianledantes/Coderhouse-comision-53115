const chai = require('chai')
const supertest = require('supertest')
const { createRandromNewUser } = require('../src/mocks/generateUsers')
const { createRandromProduct } = require('../src/mocks/generateProducts')

const request = supertest('http://localhost:8080')

const expect = chai.expect

describe('Carts', () => {
    const randomUser = createRandromNewUser()
    let sessionCookie = null
    let idProduct = null

    before('inicia la sesion y crea un producto', async () => {
        // registra un usuario random
        await request
            .post('/api/sessions/register')
            .send(randomUser)

        // inicia la sesion con el usuario random
        const response = await request
            .post('/api/sessions/login')
            .send({ email: randomUser.email, password: randomUser.password })

        // verifica que tenga la cookie de sesion
        sessionCookie = response.headers['set-cookie'][0]
        expect(sessionCookie).to.include('connect.sid', 'No hay cookie de sesion')

        const currentUserResponse = await request
            .get('/api/sessions/current')
            .set('Cookie', sessionCookie)

        expect(currentUserResponse.status).to.equal(200, 'No se pudo obtener el usuario')
        expect(currentUserResponse.body).to.have.property('email', randomUser.email, 'El email del usuario no es el mismo que el registrado')
        expect(currentUserResponse.body).to.have.property('role', 'premium', 'El rol del usuario no es premium')

        // crea un producto random
        const product = createRandromProduct()

        const { body, status } = await request
            .post('/api/products')
            .set('Cookie', sessionCookie)
            .send(product)

        expect(status).to.equal(201, 'No se pudo crear el producto')
        expect(body).to.have.property('message', 'Product created')
        expect(body).to.have.property('product')

        idProduct = body.product.id

        expect(idProduct).to.be.a('string', 'El id del producto no es un string, ' + idProduct)

    })

    after('cierra la sesion y elimina el producto', async () => {
        // elimina el producto
        const { status: statusDelete } = await request
            .delete(`/api/products/${idProduct}`)
            .set('Cookie', sessionCookie)
        expect(statusDelete).to.equal(200, 'No se pudo eliminar el producto con id ' + idProduct)

        // cierra la sesion
        const { status } = await request
            .get('/api/sessions/logout')
            .set('Cookie', sessionCookie)
        expect(status).to.equal(302, 'No se pudo cerrar la sesion')
    })

    beforeEach('vacia el carrito del usuario', async () => {
        const { status } = await request
            .delete('/api/carts')
            .set('Cookie', sessionCookie)

        expect(status).to.equal(200)
    })

    it('Obtiene el carrito del usuario', async () => {
        const { body, status } = await request
            .get('/api/carts')
            .set('Cookie', sessionCookie)

        expect(status).to.equal(200)
        expect(body).to.have.property('products')
        expect(body.products).to.be.an('array')
    })

    it('crea un carrito vacio', async () => {
        const { status, body } = await request
            .post('/api/carts')
            .set('Cookie', sessionCookie)

        expect(status).to.equal(201)
    })

    it('agrega un producto al carrito un producto que no existe da error', async () => {
        const { status } = await request
            .post('/api/carts/1/products/1')
            .set('Cookie', sessionCookie)

        expect(status).to.equal(404)
    })

    it('agrega un producto al carrito', async () => {
        // agrega el producto al carrito
        const { status: statusAdd } = await request
            .post(`/api/carts/products/${idProduct}`)
            .set('Cookie', sessionCookie)

        expect(statusAdd).to.equal(200)
    })

    it('agrega un producto dos veces al carrito', async () => {
        // agrega el producto al carrito
        const { body: bodyAdd, status: statusAdd } = await request
            .post(`/api/carts/products/${idProduct}`)
            .set('Cookie', sessionCookie)

        expect(statusAdd).to.equal(200)
        expect(bodyAdd).to.have.property('products')
        expect(bodyAdd.products).to.be.an('array').and.to.have.lengthOf(1)

        // agrega nuevamente el producto al carrito
        const { body: bodyAdd2, status: statusAdd2 } = await request
            .post(`/api/carts/products/${idProduct}`)
            .set('Cookie', sessionCookie)

        expect(statusAdd2).to.equal(200)
        expect(bodyAdd2).to.have.property('products')
        expect(bodyAdd2.products).to.be.an('array').and.to.have.lengthOf(1)
        const product = bodyAdd2.products[0]
        expect(product).to.have.property('quantity', 2, 'La cantidad del producto no es 2')
    })

})