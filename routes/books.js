const {Router} = require('express')
const Book = require('../models/book')
const router = Router()
const auth = require('../middleware/auth')
const pagination = require('../middleware/pagination')




router.get('/', pagination(Book), async (req, res) => {
    const books = await Book.find()
    const booksObj = res.paginatedResults.results
    const limit = req.query.limit
    const page = req.query.page
    const active = +req.query.active
    const sort = req.query.sort
    let lastPage = 1
    let one = false
    let two = false
    let three = false

    switch (active) {
        case 1: one = true
            break
        case 2: two = true
            break
        case 3: three = true
            break
        default: 
        break
    }

    if (books.length % Number(req.query.limit) === 0) {
        lastPage = (books.length / Number(req.query.limit))
    } else {
        lastPage = Math.floor(books.length / Number(req.query.limit)) + 1
    }

    // console.log('lastpage = ', lastPage)
    // console.log('req.page = ', req.query.page)
    // console.log('req.limit = ', req.query.limit)
    // console.log('res.pagination = ', res.paginatedResults)

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
            next: res.paginatedResults.next,
            previous: res.paginatedResults.previous,
            lastPage,
            limit,
            page,
            active,
            one,
            two,
            three,
            sort,
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
    res.redirect('/books?page=1&limit=3&active=1&sort=cheaperFirst')
})

router.post('/remove', auth,  async (req, res) => {
    try {
        await Book.deleteOne({_id: req.body.id})
        res.redirect('/books?page=1&limit=3&active=1&sort=cheaperFirst')
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