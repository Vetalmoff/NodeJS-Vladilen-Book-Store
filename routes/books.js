const {Router} = require('express')
const Book = require('../models/book')
const router = Router()



router.get('/', async (req, res) => {
    const books = await Book.getAll()
    res.render('books', {
        title: 'Books',
        isBooks: true,
        books
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const book = await Book.getById(req.params.id)

    res.render('book-edit', {
        title: `Edit ${book.title}`,
        book
    })
})

router.post('/edit', async (req, res) => {
    await Book.update(req.body)
    res.redirect('/books')
})

router.get('/:id', async (req, res) => {
    const book = await Book.getById(req.params.id) 
    res.render('book', {
        layout: 'empty',
        title: `book ${book.title}`,
        book
    })
})




module.exports = router