function purchase(cartId) {
    fetch(`/api/carts/${cartId}/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            
            if (data.status === 'error') {   
                alert("Error: " + data.message)
            } else {
                alert("Compra realizada con éxito")
                location.reload()
            }        
        })
}

function emptyCart(cartId) {
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            location.reload()
        })
        .catch(error => {
            console.error(error)
            alert("Error al vaciar el carrito")
        })
}