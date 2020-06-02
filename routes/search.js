const {Router} = require('express')
const Book = require('../models/book')
const router = Router()

router.get('/', async (req, res) => {
    const responseBooks = await Book.search(req.query.word)
    console.log(req.query)
    console.log(responseBooks)

    res.status(200).json(responseBooks)
})


module.exports = router