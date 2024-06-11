async function addProductToCart(idProduct) {
    await fetch(`/api/carts/products/${idProduct}`, {
        method: "POST"
    })
}