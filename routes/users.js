const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/people');  // Fixed the path based on your provided structure

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { username, email, password, password2 } = req.body;
    let errors = [];

    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least six characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            email,
            password
        });
    } else {
        User.findOne({ Username: username })  // Note the capital 'U' since that's how the schema is defined
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Username already registered' });
                    res.render('register', {
                        errors,
                        username,
                        email,
                        password
                    });
                } else {
                    const newUser = new User({
                        Username: username,
                        Email: email,
                        Password: password
                    });

                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.Password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.Password = hash;

                            newUser
                                .save()
                                .then(value => {
                                    req.flash('success_msg', 'You have now registered!');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        })
                    );
                }
            });
    }
});




router.post('/login', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })(req,res,next);
})

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
    })
    res.redirect('/');
})

module.exports = router;