const chai = require('chai')
const supertest = require('supertest')
const { createRandromNewUser } = require('../src/mocks/generateUsers')
const { createRandromProduct } = require('../src/mocks/generateProducts')

const request = supertest('http://localhost:8080')

const expect = chai.expect

describe('Products', () => {
    const randomUser = createRandromNewUser()
    let sessionCookie = null

    before('inicia la sesion con un usuario y devolver una cookie', async () => {
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
    })

    it('Obtiene los productos paginados', async () => {
        const { body, status } = await request
            .get('/api/products')

        expect(status).to.equal(200)
        expect(body).to.have.property('status', 'success')
        expect(body).to.have.property('payload')
        expect(body).to.have.property('prevPage')
        expect(body).to.have.property('nextPage')
        expect(body).to.have.property('page')
        expect(body).to.have.property('hasPrevPage')
        expect(body).to.have.property('hasNextPage')
        expect(body).to.have.property('prevLink')
        expect(body).to.have.property('nextLink')

        expect(body.payload).to.be.an('array')
        expect(body.page).to.be.a('number')
    })

    it('crea un producto sin usuario da error', async () => {
        const randomProduct = createRandromProduct()

        const { body, status } = await request
            .post('/api/products')
            .send(randomProduct)
        expect(status).to.equal(403)
        expect(body).to.have.property('status', 'error')
    })

    it('crea un producto con un usuario', async () => {
        const randomProduct = createRandromProduct()

        const { body, status } = await request
            .post('/api/products')
            .set('Cookie', sessionCookie)
            .send(randomProduct)

        expect(status).to.equal(201)
        expect(body).to.have.property('message', 'Product created')
        expect(body).to.have.property('product')
        expect(body.product).to.have.property('id')

        const idProduct = body.product.id

        // elimina el producto creado
        const { body: bodyDelete, status: statusDelete } = await request
            .delete(`/api/products/${idProduct}`)
            .set('Cookie', sessionCookie)

        expect(statusDelete).to.equal(200)
        expect(bodyDelete).to.have.property('message', `Product ${idProduct} deleted`)
    })

    it('crear un producto ya existente da error', async () => {

        const randomProduct = createRandromProduct()

        const { body, status } = await request
            .post('/api/products')
            .set('Cookie', sessionCookie)
            .send(randomProduct)

        expect(body).to.have.property('message', 'Product created')
        expect(body).to.have.property('product')
        expect(body.product).to.have.property('id')
        const idProduct = body.product.id        

        expect(status).to.equal(201)

        const { status: statusError } = await request
            .post('/api/products')
            .set('Cookie', sessionCookie)
            .send(randomProduct)

        expect(statusError).to.equal(400)

        // elimina el producto creado
        const { status: statusDelete } = await request
            .delete(`/api/products/${idProduct}`)
            .set('Cookie', sessionCookie)

        expect(statusDelete).to.equal(200)
    })

    it('crea un producto con propiedades incorrectas', async () => {
        const randomProduct = {
            name: 'Producto incorrecto',
            price: 'incorrecto',
            stock: 'incorrecto'
        }

        const { body, status } = await request
            .post('/api/products')
            .set('Cookie', sessionCookie)
            .send(randomProduct)

        expect(status).to.equal(400)
    })

    after('cierra la sesion', async () => {
        const { status } = await request
            .get('/api/sessions/logout')
            .set('Cookie', sessionCookie)

        expect(status).to.equal(302)
    })

})