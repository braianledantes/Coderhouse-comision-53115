const { Router } = require('express')

const createUsersRouter = ({ usersController }) => {
    const router = Router()

    router.put('/premium/:uid', usersController.changeUserRole)

    router.get('/', usersController.getAllUsers)

    router.delete('/', usersController.deleteInactiveUsers)

    return router
}

module.exports = createUsersRouter