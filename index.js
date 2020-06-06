const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home.js')
const addRoutes = require('./routes/add')
const booksRoutes = require('./routes/books')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const searchRoutes = require('./routes/search')
const authRoutes = require('./routes/auth')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')
const PORT = process.env.PORT || 3000
const MONGODB_URI ='mongodb+srv://Vitalii:MDJ0agwc8D1HqORC@cluster0-iuznr.mongodb.net/shop'



const app = express()

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
}));

app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'som secret value',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/books', booksRoutes)
app.use('/cart', cartRoutes)
app.use('/search', searchRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)



async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false})
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(e) {
        console.log(e)
    }
   
}

start()
