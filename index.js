const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const PORT = process.env.PORT || 3000
const homeRoutes = require('./routes/home.js')
const addRoutes = require('./routes/add')
const booksRoutes = require('./routes/books')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const searchRoutes = require('./routes/search')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const User = require('./models/user')


const app = express()


app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
}));

app.set('view engine', 'hbs')
app.set('views', 'views')

app.use( async (req, res, next) => {
    try {
        // const firstUser = await User.findOne()
        // const id = firstUser._id
        //const user = await User.findOne()
        const user = await User.findById('5ed8bb2b8ac4fd16f3fd0e57')
        req.user = user
        next()
    } catch (e) {
        console.log(e)
    }
    
})


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/books', booksRoutes)
app.use('/cart', cartRoutes)
app.use('/search', searchRoutes)
app.use('/orders', ordersRoutes)



async function start() {
    try {
        const url ='mongodb+srv://Vitalii:MDJ0agwc8D1HqORC@cluster0-iuznr.mongodb.net/shop'
        await mongoose.connect(url, {useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false})
            const candidate = await User.findOne()
            if (!candidate) {
                const user = new User({
                    email: 'vetalmoff@gmail.com',
                    name: 'Vitalii',
                    cart: {items: []}
                })
                await user.save()
            }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(e) {
        console.log(e)
    }
   
}

start()
