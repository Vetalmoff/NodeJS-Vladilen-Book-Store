const {Router} = require('express')
const router = Router()
const Card = require('../models/card')
const Book = require('../models/book')


router.post('/add', async (req, res) => {
    const book = await Book.getById(req.body.id)
    await Card.add(book)
    res.redirect('/card')
})

router.get('/', async (req, res) => {
    const card = await Card.fetch()
    res.render('card', {
        title: 'Card',
        isCard: true,
        books: card.books,
        price: card.price
    })
})


module.exports = router