const express = require('express')
const products = require('./routers/products.router')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))
app.use('/api/products', products)


app.listen(PORT, () => {
    
    console.log(`App listening on port ${PORT}`);
})