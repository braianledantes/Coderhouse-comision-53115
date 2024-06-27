const { CustomError } = require("../errors/CustomError")
const ERROR_CODES = require("../errors/errorCodes")

const ROLES = {
    ADMIN:  "admin",
    NORMAL: "user",
    PREMIUM: "premium"
}

module.exports = {
    userIsLoggedIn: (req, res, next) => {
        // el usuario debe tener una sesion iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (!isLoggedIn) {
            throw new CustomError({
                name: "PermissionDenied",
                message: "User should be logged in!",
                code: ERROR_CODES.PERMISSION_DENIED
            })
        }

        next()
    },
    userIsNotLoggedIn: (req, res, next) => {
        // el usuario debe tener una sesion iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (isLoggedIn) {
            throw new CustomError({
                name: "PermissionDenied",
                message: "User should not be logged in!",
                code: ERROR_CODES.PERMISSION_DENIED
            })
        }

        next()
    },
    validateUserRoles: (...roles) => (req, res, next) => {
        const isRoleValid = roles.includes(req.session.user.role)
        if (!isRoleValid) {
            throw new CustomError({
                name: "PermissionDenied",
                message: "User should have a valid role!",
                code: ERROR_CODES.PERMISSION_DENIED
            })
        }

        next()
    },
    ROLES
}