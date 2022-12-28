const { check } = require('express-validator');
 
exports.signupValidation = [
    check('firstName', 'First name is requied').not().isEmpty(),
    check('lastName', 'Last name is requied').not().isEmpty(),
    check('username', 'User name is requied').not().isEmpty(),
    //check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]
 
exports.loginValidation = [
    check('username', 'User name is requied').not().isEmpty(),
    //check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
 
]