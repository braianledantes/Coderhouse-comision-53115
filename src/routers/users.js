const { Router } = require('express')
const { userIsLoggedIn, validateUserRoles } = require('../middlewares/auth')
const { ROLES } = require('../data/userRoles')

const createUsersRouter = ({ usersController }) => {
    const router = Router()

    router.put('/premium/:uid', usersController.changeUserRole)

    router.get('/', usersController.getAllUsers)

    router.delete('/', usersController.deleteInactiveUsers)

    router.delete('/:uid', userIsLoggedIn, validateUserRoles(ROLES.ADMIN), usersController.deleteUserById)

    return router
}

module.exports = createUsersRouter