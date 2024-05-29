const MongoDataBase = require("./mongodb/MongoDataBase");

class ModelsFactory {
    static createDatabaseImplementation(type) {
        let database;

        switch (type) {
            case 'mongodb':
                database = new MongoDataBase();
                break;
            default:
                throw new Error('Tipo de implementación de base de datos no válido');
        }

        return database;
    }
}


module.exports = ModelsFactory;