const express = require('express');
const router = express.Router();
const { signupValidation, loginValidation } = require('../_middleware/validate-request'); 
//const validateRequest = require('_middleware/validate-request');
const authorize = require('../_middleware/authorize')
const userService = require('./user.service');

// routes
router.post('/authenticate',loginValidation, authenticate);
router.post('/register',signupValidation, register);
router.get('/', userauthorize, getAll);
router.get('/current', userauthorize, getCurrent);
router.get('/:id', userauthorize, getById);
router.put('/:id', userauthorize, update);
router.delete('/:id', userauthorize, _delete);

module.exports = router;
function authenticate(req, res, next) {
    //console.log(req.body);
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function register(req, res, next) {    
    //console.log(req.body);
    userService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function userauthorize(req, res, next) {
    //console.log(req.headers);
    authorize(req.headers)
        .then(user => next())
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next); 
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}