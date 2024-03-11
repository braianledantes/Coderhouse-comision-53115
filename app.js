const express = require('express')
const handlebars = require('express-handlebars')
const morgan = require('morgan')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const products = require('./routers/products.routes')
const carts = require('./routers/carts.routes')
const views = require('./routers/views.routes')

const PORT = 8080

const app = express()
const server = createServer(app)
const io = new Server(server)
app.set('websocket', io)

app.engine('handlebars', handlebars.engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))

app.use(express.static('public'))
app.use('/api/products', products)
app.use('/api/carts', carts)
app.use('/', views)

io.on('connection', socket => {
    console.log('Cliente conectado')
})

server.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
})