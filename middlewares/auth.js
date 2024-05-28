module.exports = {
    userIsLoggedIn: (req, res, next) => {
        // el usuario debe tener una sesion iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (!isLoggedIn) {
            return res.status(401).json({ error: "User should be logged in!"})
        }

        next()
    },
    userIsNotLoggedIn: (req, res, next) => {
        // el usuario debe tener una sesion iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (isLoggedIn) {
            return res.status(401).json({ error: "User should not be logged in!"})
        }

        next()
    },
    isUserAdmin: (req, res, next) => {
        // el usuario debe ser admin
        const isAdmin = req.session.user.role === "admin"
        if (!isAdmin) {
            return res.status(401).json({ error: "User should be admin!" })
        }

        next()
    },
    isNormalUser: (req, res, next) => {
        // el usuario debe ser admin
        const isNormalUser = req.session.user.role === "user"
        if (!isNormalUser) {
            return res.status(401).json({ error: "User should be normal user!" })
        }

        next()
    }
}