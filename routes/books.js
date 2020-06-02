const {Router} = require('express')
const Book = require('../models/book')
const router = Router()



router.get('/' ,async (req, res) => {
    //const books = await Book.getAll()
    const booksObj = await Book.pagination(req.query)
    console.log(req.query)
    console.log(booksObj)
    if (req.query.xhttp) {
        res.status(200).json(booksObj)
    } else {
        res.render('books', {
            title: 'Books',
            isBooks: true,
            view: booksObj.view.body,
            booksObj
        })
    }
    
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
    console.log(req.query)
    console.log(req.params)
    const book = await Book.getById(req.params.id) 
    res.render('book', {
        layout: 'empty',
        title: `book ${book.title}`,
        book
    })
})




module.exports = router