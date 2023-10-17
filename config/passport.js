const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');


module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: "email", passwordField: 'password', passReqToCallback:false, session:true}, (email,password,done)=> {
            console.log('Local Strat Works')
            User.findOne({email: email})
            .then((user)=>{
                if(!user){
                    return done(null, false, {message: 'that email is not registered'})
                }

                // match pass
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err) {throw err;}

                    if(isMatch) {
                        console.log(email + " " + password)
                        console.log(user)
                        return done(null, user)
                    }else {
                        return done(null, false, {message: 'pass incorrect'})
                    }
                })
            })
            .catch((err) => {
                return done(err, false, { message: 'An error occurred' });
            });
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id).then((err, user)=>{
            done(user, err)
        }).catch((err)=>{
            done(err, null)
        })
    })

}