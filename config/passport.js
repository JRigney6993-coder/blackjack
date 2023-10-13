const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/people');  // updated the path

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: false,
                session: true
            },
            (username, password, done) => {
                // Match user
                User.findOne({ Username: username })  // updated field name
                    .then((user) => {
                        if (!user) {
                            return done(null, false, { message: 'That email or username is not registered' });
                        }
                        bcrypt.compare(password, user.Password, (err, isMatch) =>  // updated field name
                        {
                            if (err) {
                                console.error('Error during password comparison:', err);
                                return done(err);
                            }
                            if (isMatch) {
                                return done(null, user);
                            } else {
                                return done(null, false, { message: 'Password incorrect' });
                            }
                        });
                    })
                    .catch(err => {
                        console.error('Error finding user:', err);
                    });
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    })

    passport.deserializeUser(function (id, done) {
        User.findById(id, (err, user) => {  // corrected the callback
            done(err, user);
        });
    });
};
