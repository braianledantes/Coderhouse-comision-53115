const express = require('express')
const { Command } = require('commander')
const handlebars = require('express-handlebars')
const morgan = require('morgan')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const passport = require('passport')
const initializeGithubStrategy = require('./config/passport-github.config')
const initializeLocalStrategy = require('./config/passport-local.config')
const sessionMiddleware = require('./middlewares/sessions/mongoSession')
const ModelsFactory = require('./data/ModelsFactory')
const ServicesFactory = require('./services/ServicesFactory')
const ControllersFactory = require('./controllers/ControllersFactory')
const createCartsRouter = require('./routers/carts')
const createProductsRouter = require('./routers/products')
const createChatsRouter = require('./routers/chat')
const createSessionsRouter = require('./routers/sessions')
const createViewsRouter = require('./routers/views')
const { createRandromProducts } = require('./mocks/generateProducts')

// inicializar programa
const program = new Command()
program.option('-d, --database <type>', 'Tipo de base de datos a utilizar', 'mongodb')
program.parse()
const programOptions = program.opts()

// inicializar capa de datos
const database = ModelsFactory.createDatabaseImplementation(programOptions.database)
// inicializar capa de servicios
const servicesFactory = new ServicesFactory({ database })
// inicializar controladores
const controllersFactory = new ControllersFactory({ servicesFactory })

// configurar app
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

// mock data
app.get('/mockingproducts', (_, res) => {
    res.json(createRandromProducts())
})

// iniciar app
const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
})