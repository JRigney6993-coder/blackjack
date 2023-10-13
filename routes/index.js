const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

router.get('/', (req, res) => {
    res.render('pages/welcome')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.user
    })
})

module.exports = router;
