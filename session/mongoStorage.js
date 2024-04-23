const MongoStore = require('connect-mongo')
const session = require('express-session')
const DbConfig = require('../dbConfig')

const storage = MongoStore.create({
    dbName: DbConfig.dbName,
    mongoUrl: DbConfig.mongoUrl,
    ttl: 24 * 60 * 60 // 1 dia
})

const middleware = session({
    store: storage,
    secret: 'asdflasdoiufyoidf23',
    resave: true,
    saveUninitialized: true
})

module.exports = middleware