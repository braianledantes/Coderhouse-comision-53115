const { CustomError } = require("../errors/CustomError")
const ERROR_CODES = require("../errors/errorCodes")

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
    isUserAdmin: (req, res, next) => {
        // el usuario debe ser admin
        const isAdmin = req.session.user.role === "admin"
        if (!isAdmin) {
            throw new CustomError({
                name: "PermissionDenied",
                message: "User should be admin!",
                code: ERROR_CODES.PERMISSION_DENIED
            })
        }

        next()
    },
    isNormalUser: (req, res, next) => {
        // el usuario debe ser admin
        const isNormalUser = req.session.user.role === "user"
        if (!isNormalUser) {
            throw new CustomError({
                name: "PermissionDenied",
                message: "User should be normal user!",
                code: ERROR_CODES.PERMISSION_DENIED
            })
        }

        next()
    }
}