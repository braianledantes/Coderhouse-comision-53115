const socket = io()

document.getElementById("btnCreateProduct")
    .addEventListener('click', async (event) => {
        event.preventDefault()
        createNewProduct()
    })

socket.on('product-created', (data) => {
    const productsList = document.getElementById("products-list")
    productsList.appendChild(createNewArticle(product))
})

socket.on('product-deleted', (data) => {
    const article = document.getElementById(data.productId)
    article.remove()
})

socket.on('product-updated', (data) => {
    const article = document.getElementById(data.product.id)
    article.replaceWith(createNewArticle(data.product))
})

function createNewArticle(product) {
    const article = document.createElement('article')
    article.className = 'product'
    article.id = product.id

    const img = document.createElement('img')
    img.src = product.thumbnail
    article.appendChild(img)

    const title = document.createElement('h3')
    title.textContent = product.title
    article.appendChild(title)

    const code = document.createElement('p')
    code.textContent = `Code: ${product.code}`
    article.appendChild(code)

    const stock = document.createElement('p')
    stock.textContent = `Stock: ${product.stock}`
    article.appendChild(stock)

    const price = document.createElement('p')
    price.textContent = `Price: $${product.price}`
    article.appendChild(price)

    const category = document.createElement('p')
    category.textContent = `Category: ${product.category}`
    article.appendChild(category)

    const btnDelete = document.createElement('button')
    btnDelete.textContent = `Delete`
    btnDelete.addEventListener('click', async () => {
        deleteProduct(product.id)
    })
    article.appendChild(btnDelete)

    return article
}

async function createNewProduct() {
    const codeInput = document.getElementById('code')
    const titleInput = document.getElementById('title')
    const descriptionInput = document.getElementById('description')
    const thumbnailInput = document.getElementById('thumbnail')
    const priceInput = document.getElementById('price')
    const statusInput = document.getElementById('status')
    const stockInput = document.getElementById('stock')
    const category = document.getElementById('category')

    const product = {
        code: codeInput.value,
        title: titleInput.value,
        description: descriptionInput.value,
        thumbnail: [thumbnailInput.value],
        price: parseInt(priceInput.value),
        status: statusInput.checked,
        stock: parseInt(stockInput.value),
        category: category.value,
    }

    await fetch('/api/products', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    })

    codeInput.value = ""
    titleInput.value = ""
    descriptionInput.value = ""
    thumbnailInput.value = ""
    priceInput.value = ""
    statusInput.checked = false
    stockInput.value = ""
    category.value = ""
}

async function deleteProduct(idProduct) {
    await fetch(`/api/products/${idProduct}`, {
        method: "DELETE"
    })
}