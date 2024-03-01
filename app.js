const express = require('express')
const morgan = require('morgan')
const products = require('./routers/products.router')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan())

app.use(express.static('public'))
app.use('/api/products', products)


app.listen(PORT, () => {
    
    console.log(`App listening on port ${PORT}`);
})