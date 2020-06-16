const {Router} = require('express')
const Book = require('../models/book')
const router = Router()
const auth = require('../middleware/auth')


router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add book',
        isAdd: true,
    })
})

router.post('/', auth, async (req, res) => {
    console.log('ID is : ', req.user._id)

    //const book = new Book(req.body.title, req.body.price, req.body.img)
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

