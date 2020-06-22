const {Router} = require('express')
const {validationResult} = require('express-validator')
const Book = require('../models/book')
const router = Router()
const auth = require('../middleware/auth')
const {bookValidators} = require('../utils/validators')


router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add book',
        isAdd: true,
    })
})

router.post('/', auth, bookValidators, async (req, res) => {
    console.log('ID is : ', req.user._id)

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Add book',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img
            }
        })
    }

    const book = new Book({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user._id
    })

    try {
        await book.save()
        res.redirect('/books?page=1&limit=3&active=1&sort=cheaperFirst')
    } catch (e) {
        console.log(e)
    }

})


module.exports = router

