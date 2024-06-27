const { Router } = require('express')

const createUsersRouter = ({ usersController }) => {
    const router = Router()

    router.put('/premium/:uid', usersController.changeUserRole)

    return router
}

module.exports = createUsersRouter