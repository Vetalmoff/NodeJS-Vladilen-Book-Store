const {Router} = require('express')
const Book = require('../models/book')
const router = Router()

router.get('/', async (req, res) => {

    let re = new RegExp(`${req.query.title}`, 'gi')

    console.log(req.session.books)

    Book.find({title: re} , function(err, books) {
            if (err) throw err
            req.session.books = books
           
            // res.render('books', {
            //     title: 'Books',
            //     isBooks: true,
            //     next: res.paginatedResults.next,
            //     previous: res.paginatedResults.previous,
            //     lastPage,
            //     limit,
            //     page,
            //     booksObj:req.session.books
            // })
            res.status(200).json(req.session)
    })
})


module.exports = router