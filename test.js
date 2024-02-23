const ProductManager = require('./ProductManager.js')

async function main() {
    try {
        const pm = new ProductManager("./products.json")
        await pm.initialize()

        await pm.addProduct({
            code: "1234",
            title: "Sherek 2",
            description: "",
            thumbnail: "",
            stock: 2,
            price: 23
        })
        //const product  = await pm.deleteProduct(3)
        console.log(product);
    } catch (error) {
        console.error(error);
    }
}

main()