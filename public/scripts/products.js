async function addProductToCart(idProduct) {
    await fetch(`/api/carts/6617dde2a32e02cdb884e768/product/${idProduct}`, {
        method: "POST"
    })
}