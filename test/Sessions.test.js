const chai = require('chai')
const supertest = require('supertest')
const { createRandromNewUser } = require('../src/mocks/generateUsers')

const request = supertest('http://localhost:8080')

const expect = chai.expect

describe('Sessions', () => {

    const randomUser = createRandromNewUser()
    let sessionCookie = null

    afterEach('cierra la sesion', async () => {
        if (sessionCookie !== null) {
            await request
                .get('/api/sessions/logout')
                .set('Cookie', sessionCookie)
        }
    })

    it('Debe registrar un usuario random', async () => {
        const response = await request
            .post('/api/sessions/register')
            .send(randomUser)

        // verifica que tenga la cookie de sesion
        sessionCookie = response.headers['set-cookie'][0]
        expect(sessionCookie).to.include('connect.sid', 'No hay cookie de sesion')
    })

    it('Debe iniciar la sesion con el usuario random', async () => {
        const loginResponse = await request
            .post('/api/sessions/login')
            .send({ email: randomUser.email, password: randomUser.password })

        // verifica que tenga la cookie de sesion
        sessionCookie = loginResponse.headers['set-cookie'][0]
        expect(sessionCookie).to.include('connect.sid', 'No hay cookie de sesion')

        // verifica que el usuario sea el mismo
        const response = await request
            .get('/api/sessions/current')
            .set('Cookie', sessionCookie)

        expect(response.status).to.equal(200, 'No se pudo obtener el usuario')
        expect(response.body).to.have.property('email', randomUser.email)
    })

    it('Debe fallar al iniciar sesion con un password incorrecto', async () => {
        const loginResponse = await request
            .post('/api/sessions/login')
            .send({ email: 'braianledantes@gmail.com', password: 'passwordIncorrect' })

        const currentResponse = await request
            .get('/api/sessions/current')
            .set('Cookie', sessionCookie)

        const { status, body } = currentResponse

        expect(status).to.equal(403, 'No tiene que iniciar sesion') 
        expect(body).to.have.property('status', 'error')
        expect(body).to.have.property('message', 'User should be logged in!')
    })


})