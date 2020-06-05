const {Router} = require('express')
const Book = require('../models/book')
const router = Router()



router.get('/' ,async (req, res) => {
    const booksObj = await Book.find()
        res.render('books', {
            title: 'Books',
            isBooks: true,
            booksObj
        })
    
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const book = await Book.findById(req.params.id)

    res.render('book-edit', {
        title: `Edit ${book.title}`,
        book
    })
})

router.post('/edit', async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Book.findByIdAndUpdate(id, req.body)
    res.redirect('/books')
})

router.post('/remove', async (req, res) => {
    try {
        await Book.deleteOne({_id: req.body.id})
        res.redirect('/books')
    } catch(e) {
        console.log(e)
    }
    
})

router.get('/:id', async (req, res) => {
    console.log(req.query)
    console.log(req.params)
    const book = await Book.findById(req.params.id) 
    res.render('book', {
        layout: 'empty',
        title: `book ${book.title}`,
        book
    })
})




module.exports = router