module.exports = {
    dbName: process.env.MONGO_DB_NAME || 'e-commerce',
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017'
}