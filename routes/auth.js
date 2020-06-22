const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {validationResult} = require('express-validator')
const router = Router()
const keys = require('../keys/index')
const regEmail = require('../emails/registrations')
const resetEmail = require('../emails/reset')
const sgMail = require('@sendgrid/mail')
const {registerValidators, loginValidators} = require('../utils/validators')


sgMail.setApiKey(keys.SEND_GRID_API_KEY)



router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        loginError: req.flash('login-error'),
        regError: req.flash('registration-error')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', loginValidators, async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('login-error', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login')
        }

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    } else {
                        res.redirect('/')
                    }
                })
            } else {
                req.flash('login-error', 'Such user does not exist 1')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('login-error', 'Such user does not exist 2')
            res.redirect('/auth/login#login')
        }
    } catch(e) {
        console.log(e)
    }
})

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, name} = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registration-error', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({email, name, password: hashPassword, cart: {items: []}})
        await user.save()
        console.log(user)
        sgMail.send(regEmail(email)).then(() => {
            console.log('Message sent')
        }).catch((error) => {
            console.log(error.response.body)
        })
        res.redirect('/auth/login#login')

    } catch (e) {
        console.log(e)
    }
})


router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'forgot the password',
        error: req.flash('error')
    })
})

router.get('/password/:token',  async (req, res) => {
    if (!req.params.token) {
        return res.redirect('auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'forgot the password',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }
    
    } catch(e) {
        console.log(e)
    }
    
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Something went wrong, try again later')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({email: req.body.email})

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 3600 * 1000
                await candidate.save()
                await sgMail.send(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'There is no such user')
                res.redirect('/auth/reset')
            }
        })

    } catch(e) {
        console.log(e)
    }
})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            console.log(user)
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('error', 'Token experation end')
            res.redirect('/auth/login')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router