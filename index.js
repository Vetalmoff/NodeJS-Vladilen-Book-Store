const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const PORT = process.env.PORT || 3000
const homeRoutes = require('./routes/home.js')
const addRoutes = require('./routes/add')
const booksRoutes = require('./routes/books')
const cardRoutes = require('./routes/card')
const searchRoutes = require('./routes/search')


const app = express()


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/books', booksRoutes)
app.use('/card', cardRoutes)
app.use('/search', searchRoutes)





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})