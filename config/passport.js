const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email' }, (email, password, done) => {
            //Match User
            User.findOne({ email: email })
            .then(user => {
                if(!user){
                    return done(null, false, {message: 'That e-mail is not registered!'})
                }

                // Match the Password
                bcrypt.compare(password, user.password, (err,isMatch) => {
                    if(err) throw err;

                    if(isMatch){
                        return done(null, user);
                    }else{
                        return done(null, false,{message: 'The Password you entered is incorrect'})
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
    });
}