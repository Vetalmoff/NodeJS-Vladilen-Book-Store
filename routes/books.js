const {Router} = require('express')
const Book = require('../models/book')
const router = Router()
const auth = require('../middleware/auth')




router.get('/' ,async (req, res) => {
    const booksObj = await Book.find()
    //console.log(booksObj)
    const cardTitle = booksObj.map(b => {
        if (b.title.length > 20) {
            return b.title = b.title.slice(0, 15) + '...'
        } else {
            return  b.title
        }
    })
    console.log(cardTitle)
        res.render('books', {
            title: 'Books',
            isBooks: true,
            booksObj
        })
    
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const book = await Book.findById(req.params.id)

    res.render('book-edit', {
        title: `Edit ${book.title}`,
        book
    })
})

router.post('/edit', auth, async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Book.findByIdAndUpdate(id, req.body)
    res.redirect('/books')
})

router.post('/remove', auth,  async (req, res) => {
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