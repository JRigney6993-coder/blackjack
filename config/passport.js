const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: false,
                session: true
            },
            (username, password, done) => 
            {
                console.log('Local Strategy Works');
                // Match user
                User.findOne({ username: username })
                    .then(user => 
                    {
                        if (!user) 
                        {
                            return done(null, false, { message: 'That username is not registered' });
                        }
                        bcrypt.compare(password, user.password, (err, isMatch) => 
                        {
                            if (err) 
                            {
                                throw err;
                            }
                            if (isMatch) 
                            {
                                console.log(username + ' ' + password);
                                return done(null, user);
                            } else 
                            {
                                return done(null, false, { message: 'Password incorrect' });
                            }
                        });
                    })
                    .catch(err => 
                        {
                        console.log(err);
                    });
            }
        )
    );

    passport.serializeUser(function(user,done)
    {
        done(null, user.id);
    })

    passport.deserializeUser(function(id, done)
    {
        User.findById(id).then( (err,user)=> 
        {
            done(err,user)
        })
    })

};