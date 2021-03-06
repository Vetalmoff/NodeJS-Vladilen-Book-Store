const {Router} = require('express')
const router = Router()
const Order = require('../models/order')
const auth = require('../middleware/auth')
const sgMail = require('@sendgrid/mail')
const keys = require('../keys/index')

const orderEmail = require('../emails/order')


sgMail.setApiKey(keys.SEND_GRID_API_KEY)


router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({'user.userId': req.user._id})
            .populate('user.userId')

        res.render('orders', {
            isOrder: true,
            title: 'orders',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.books.reduce((total, c) => {
                        return total += c.count * c.book.price
                    }, 0)
                }
            })
        })
    } catch(e) {
        console.log(e)
    }
    
})

router.post('/', auth, async (req, res) => {

    try {
        const user = await req.user
            .populate('cart.items.bookId')
            .execPopulate()

            console.log('Userpopulate = ', user)

        const books = user.cart.items.map(i => ({
            count: i.count,
            book: {...i.bookId._doc}
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            books
        })

        await order.save()
        await req.user.clearCart()
        //await sgMail.send(orderEmail(user.email))


        res.redirect('/orders')
    } catch(e) {
        console.log(e)
    }
    
})


module.exports = router