const express = require('express');
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard'); 
    } else {
        res.redirect('/users/login');
    }
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('pages/dashboard', {
        user: req.user
    });
});


module.exports = router;