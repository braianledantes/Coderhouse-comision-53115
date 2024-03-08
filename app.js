const express = require('express')
const handlebars = require('express-handlebars')
const morgan = require('morgan')
const products = require('./routers/products.routes')
const carts = require('./routers/carts.routes')
const views = require('./routers/views.routes')

const app = express()
const PORT = 8080

app.engine('handlebars', handlebars.engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))

app.use(express.static('public'))
app.use('/api/products', products)
app.use('/api/carts', carts)
app.use('/', views)


app.listen(PORT, () => {
    
    console.log(`App listening on port ${PORT}`);
})