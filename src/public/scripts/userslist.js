function deleteUserById(id) {
    return fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data?.user) location.reload()
        })
}

// funcion para cambiar el rol de un usuario
function changeRoleToPremium(id) {
    return fetch(`/api/users/premium/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(user => {
            if (user) location.reload()
        })
}