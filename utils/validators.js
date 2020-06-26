const {body} = require('express-validator')
const User = require('../models/user')


exports.registerValidators = [
    body('email').isEmail().withMessage('Input correct email!').custom(async (value, {req}) => {
        try{
            const user = await User.findOne({ email: value })
            if (user) {
                return Promise.reject('User with this email is already registered!')
            }

        } catch (e) {
            console.log(e)
        }
    }).normalizeEmail(),

    body('password', 'Input correct value!').isLength({min: 6, max: 45}).isAlphanumeric().trim(),//trim - убирает лишние пробелы,
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password){
        throw new Error('Passwords are not same!')
        }
        return true
    }).trim(),
    body('name').isLength({min:3, max: 100}).withMessage('Input correct name!')
    .trim() 
]

exports.courseValidators = [
    body('title').isLength({min: 3, max: 20}).withMessage('Input correct title!'),
    body('price').isNumeric().withMessage('Input correct price!'),
    body('img', 'Input correct price!').isURL()
]