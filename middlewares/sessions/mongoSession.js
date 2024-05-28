const MongoStore = require('connect-mongo')
const session = require('express-session')
const DbConfig = require('../../config/mongodb.config')
const sessionsConfig = require('../../config/sessions.config')

const storage = MongoStore.create({
    dbName: DbConfig.dbName,
    mongoUrl: DbConfig.mongoUrl,
    ttl: process.env.SESSION_TTL || 60 * 60 * 24
})

const sessionMiddleware = session({
    store: storage,
    ...sessionsConfig
})

module.exports = sessionMiddleware