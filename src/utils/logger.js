const { fa } = require('@faker-js/faker')
const winston = require('winston')

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'magenta',
        debug: 'white'
    }
}

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.json()
            ),
        }),
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            level: 'error',
            filename: `${__dirname}/../logs/errors.log`,
            format: winston.format.simple()
        }),
    ]
})

/**
 * @typedef {import('express').Request} Request
 */
const addLogger = (req, _res, next) => {
    req.logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger
    next()
}

module.exports = { addLogger }