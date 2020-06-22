const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const csrf = require('csurf')
const flash = require('connect-flash')
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
const profileRoutes = require('./routes/profile')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const keys = require('./keys/index')
const fileMiddleware = require('./middleware/file')
const PORT = process.env.PORT || 3000



const app = express()

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbd-helpers')
}));

app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')))
app.use('/images',express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    cookie:{
        httpOnly: true
    },
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(fileMiddleware.single('avatar'))

app.use(csrf())
app.use(flash())

app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/books', booksRoutes)
app.use('/cart', cartRoutes)
app.use('/search', searchRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)


app.use(errorHandler)



async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {useNewUrlParser: true,
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
