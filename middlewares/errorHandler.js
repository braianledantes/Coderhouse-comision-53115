const ERROR_CODES = require('../errors/errorCodes')

function errorHandler(error, _req, res, _next) {
    console.error(error)

    switch (error.code) {
        case ERROR_CODES.INVALID_INPUT:
            res.status(400).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        case ERROR_CODES.MISSING_PARAMETER:
            res.status(400).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        case ERROR_CODES.DATABASE_ERROR:
            res.status(500).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        case ERROR_CODES.NETWORK_ERROR:
            res.status(500).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        case ERROR_CODES.AUTHENTICATION_FAILED:
            res.status(401).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        case ERROR_CODES.PERMISSION_DENIED:
            res.status(403).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        default:
            res.status(500).json({ status: 'error', message: 'Internal server error' })
            break;
    }
}

module.exports = errorHandler