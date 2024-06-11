const MongoDataBase = require("./mongodb/MongoDataBase");
const { CustomError } = require("../errors/CustomError");
const ERROR_CODES = require("../errors/errorCodes");

class ModelsFactory {
    static createDatabaseImplementation(type) {
        let database;

        switch (type) {
            case 'mongodb':
                database = new MongoDataBase();
                break;
            default:
                throw new CustomError({
                    name: 'InvalidDatabaseType',
                    message: 'Invalid database type',
                    code: ERROR_CODES.INVALID_DATABASE_TYPE
                });
        }

        return database;
    }
}


module.exports = ModelsFactory;