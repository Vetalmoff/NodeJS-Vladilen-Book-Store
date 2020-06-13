const {Router} = require('express')
const router = Router()
const Book = require('../models/book')
const User = require('../models/user')
const auth = require('../middleware/auth')


function mapCartItems(cart)  {
    return cart.items.map(b => ({
         ...b.bookId._doc,
         id: b.bookId.id,
         count: b.count
    }))
}

function computePrice(books) {
    return  books.reduce((total, book) => {
        return total += book.price * book.count
    }, 0)
}


router.post('/add', auth, async (req, res) => {
    const book = await Book.findById(req.body.id)
    await req.user.addToCart(book)
    res.redirect('/cart')
})

router.get('/', auth, async (req, res) => {
    const user = await req.user.populate('cart.items.bookId').execPopulate()
     //console.log('populate :', user.cart.items)
    // console.log('not populate : ', req.user.cart.items)

    const books = mapCartItems(user.cart)
    //console.log(user.cart.items)
    //console.log(req.user.cart.items)
    //console.log(books)
    //console.log('Csrf from cart res.locsls = ' ,res.locals.csrf)


    res.render('cart', {
        title: 'Cart',
        isCard: true,
        books: books,
        price: computePrice(books)
    })
})

router.delete ('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)

    const user = await req.user.populate('cart.items.bookId').execPopulate()
    const books = mapCartItems(user.cart)
    const cart = {
        books, price: computePrice(books)
    }

   res.status(200).json(cart)
})


module.exports = router