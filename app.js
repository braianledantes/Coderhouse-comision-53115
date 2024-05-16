const express = require('express')
const handlebars = require('express-handlebars')
const morgan = require('morgan')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const passport = require('passport')
const initializeGithubStrategy = require('./config/passport-github.config')
const initializeLocalStrategy = require('./config/passport-local.config')
const sessionMiddleware = require('./session/mongoStorage')
const MongoDataBase = require('./models/mongodb/MongoDataBase')
const CartsService = require('./services/carts')
const ChatsService = require('./services/chats')
const ProductsService = require('./services/products')
const UsersService = require('./services/users')
const CartsController = require('./controllers/carts')
const ChatsController = require('./controllers/chats')
const ProductsController = require('./controllers/products')
const SessionsController = require('./controllers/sessions')
const ViewsController = require('./controllers/views')
const createCartsRouter = require('./routers/carts')
const createProductsRouter = require('./routers/products')
const createChatsRouter = require('./routers/chat')
const createSessionsRouter = require('./routers/sessions')
const createViewsRouter = require('./routers/views');

// inicializar capas
const mongodb = new MongoDataBase()
const cartsDao = mongodb.getCartsDao()
const productsDao = mongodb.getProductsDao()
const messagesDao = mongodb.getMessagesDao()
const usersDao = mongodb.getUsersDao()

const cartsService = new CartsService({ cartsDao, productsDao })
const productsService = new ProductsService({ productsDao })
const chatsService = new ChatsService({ messagesDao })
const usersService = new UsersService({ usersDao })

const cartsController = new CartsController({ cartsService })
const chatsController = new ChatsController({ chatsService })
const productsController = new ProductsController({ productsService })
const sessionsController = new SessionsController({ usersService })
const viewsController = new ViewsController({ cartsService, chatsService, productsService, usersService })

// configurar app
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
app.use(sessionMiddleware)

initializeGithubStrategy({ usersService })
initializeLocalStrategy({ usersService })
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))
app.use('/api/carts', createCartsRouter({ cartsController }))
app.use('/api/chat', createChatsRouter({ chatsController }))
app.use('/api/products', createProductsRouter({ productsController }))
app.use('/api/sessions', createSessionsRouter({ sessionsController }))
app.use('/', createViewsRouter({ viewsController }))

io.on('connection', socket => {
    console.log('Cliente conectado')
})

server.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
})