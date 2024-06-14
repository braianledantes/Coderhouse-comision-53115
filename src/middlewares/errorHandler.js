const ERROR_CODES = require('../errors/errorCodes')

function errorHandler(error, req, res, _next) {

    switch (error.code) {
        case ERROR_CODES.INVALID_INPUT:
            req.logger.error('Error 400 - Parametro invalido', error)
            res.status(400).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        case ERROR_CODES.MISSING_PARAMETER:
            req.logger.error('Error 400 - Parametro desconocido', error)
            res.status(400).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        case ERROR_CODES.DATABASE_ERROR:
            req.logger.error('Error 500 - Error en Base de Datos', error)
            res.status(500).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        case ERROR_CODES.NETWORK_ERROR:
            req.logger.error('Error 500 - Error Network', error)
            res.status(500).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        case ERROR_CODES.AUTHENTICATION_FAILED:
            req.logger.error('Error 401 - Fallo de autenticacion', error)
            res.status(401).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        case ERROR_CODES.PERMISSION_DENIED:
            req.logger.error('Error 403 - Permiso denegado', error)
            res.status(403).json({ status: 'error', message: error.message, cause: error.cause })
            break;
        default:
            req.logger.error('Error 500 - Internal server error', error)
            res.status(500).json({ status: 'error', message: 'Internal server error' })
            break;
    }
}

module.exports = errorHandler