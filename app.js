const express = require('express')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const morgan = require('morgan')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const productsRouter = require('./routers/products.routes')
const cartsRouter = require('./routers/carts.routes')
const chatRouter = require('./routers/chat.routes')
const viewsRouter = require('./routers/views.routes')

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
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/chat', chatRouter)
app.use('/', viewsRouter)

const main = async () => {
    await mongoose.connect(
        'mongodb+srv://braianledantes:chutebnl@codercluster.hi6cwhh.mongodb.net/',
        {
            dbName: 'e-commerce'
        }
    )

    io.on('connection', socket => {
        console.log('Cliente conectado')
    })
    
    server.listen(PORT, () => {
        console.log(`App listening on http://localhost:${PORT}`);
    })
}

main()