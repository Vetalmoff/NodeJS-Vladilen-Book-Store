const {body} = require('express-validator')
const User = require('../models/user')

module.exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Input correct email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                console.log(user)
                if (user) {
                    return Promise.reject('User with this email already exist')
                } 
            } catch (e) {
                console.log(e)
            }
        })
        .normalizeEmail(),
    body('name')
        .isLength({min: 3}).withMessage('Name must be minimum 3 characters length')
        .trim(),
    body('password', 'Password must be minimum 6 characters length')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must be the same')
            }
            return true
        })
        .trim(),
]

module.exports.loginValidators = [
    body('email')
        .isEmail().withMessage('Input correct email'),
    body('password', 'Password must be minimum 6 characters length')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim()
]

module.exports.bookValidators = [
    body('title')
        .isLength({min: 3}).withMessage('Name must be minimum 3 characters length').trim(),
    body('price')
        .isNumeric().withMessage('Input correct price'),
    body('img')
        .isURL().withMessage('Input correct URL')

]