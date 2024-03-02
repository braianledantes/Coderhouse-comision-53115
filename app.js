const express = require('express')
const morgan = require('morgan')
const products = require('./routers/products.routes')
const carts = require('./routers/carts.routes')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))

app.use(express.static('public'))
app.use('/api/products', products)
app.use('/api/carts', carts)


app.listen(PORT, () => {
    
    console.log(`App listening on port ${PORT}`);
})