const express = require('express')
const handlebars = require('express-handlebars')
const morgan = require('morgan')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const passport = require('passport')
const initializeGithubStrategy = require('./config/passport-github.config')
const initializeLocalStrategy = require('./config/passport-local.config')
const sessionMiddleware = require('./middlewares/sessions/mongoSession')
const MongoDataBase = require('./models/mongodb/MongoDataBase')
const ServicesFactory = require('./services/ServicesFactory')
const ControllersFactory = require('./controllers/ControllersFactory')
const createCartsRouter = require('./routers/carts')
const createProductsRouter = require('./routers/products')
const createChatsRouter = require('./routers/chat')
const createSessionsRouter = require('./routers/sessions')
const createViewsRouter = require('./routers/views')

// inicializar capa de datos
const mongodb = new MongoDataBase()
// inicializar capa de servicios
const servicesFactory = new ServicesFactory({ database: mongodb })
// inicializar controladores
const controllersFactory = new ControllersFactory({ servicesFactory })

// configurar app
const PORT = 8080

const app = express()

// websocket
const server = createServer(app)
const io = new Server(server)
io.on('connection', socket => {
    console.log('Cliente conectado')
})
app.set('websocket', io)

// handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))
app.use(sessionMiddleware)

// se inicializan las estrategias de passport
initializeGithubStrategy({ usersService: servicesFactory.getUsersServiceInstance()})
initializeLocalStrategy({ usersService: servicesFactory.getUsersServiceInstance()})
app.use(passport.initialize())
app.use(passport.session())

// public web site
app.use(express.static('public'))

// api routers
app.use('/api/carts', createCartsRouter({ cartsController: controllersFactory.createCartsController() }))
app.use('/api/chat', createChatsRouter({ chatsController: controllersFactory.createChatsController() }))
app.use('/api/products', createProductsRouter({ productsController: controllersFactory.createProductsController()}))
app.use('/api/sessions', createSessionsRouter({ sessionsController: controllersFactory.createSessionsController()}))
// views routers
app.use('/', createViewsRouter({ viewsController: controllersFactory.createViewsController()}))

// iniciar app
server.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
})