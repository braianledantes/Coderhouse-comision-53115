const MongoStore = require('connect-mongo')
const session = require('express-session')
const DbConfig = require('../../config/mongodb.config')

const storage = MongoStore.create({
    dbName: DbConfig.dbName,
    mongoUrl: DbConfig.mongoUrl,
    ttl: process.env.MONOGO_SESSION_TTL || 60 * 60 * 24
})

const sessionMiddleware = session({
    store: storage,
    secret: 'asdflasdoiufyoidf23',
    resave: true,
    saveUninitialized: true
})

module.exports = sessionMiddleware