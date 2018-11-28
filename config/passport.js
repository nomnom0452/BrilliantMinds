const   localStrategy   = require('passport-local').Strategy,
        StudentModel    = require('../models/student-model'),
        InstructorModel = require('../models/instructor-model'),
        config          = require('../config/database'),
        bcrypt          = require('bcryptjs'),
        passport        = require('passport');

/*========================Auth for student========================*/

//student login
passport.use('student-local', new localStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, function(req, email, password, done){
    let query = {email: email};
    StudentModel.findOne(query, function(err, user){
        if(err) throw err
        if(!user){
            return done(null, false, {message: 'No User Found'});
        }

        if(!user.comparePassword(password)){
            return done(null, false);
        }
        return done(null, user);
    });
}));

/*========================Auth for instructor========================*/
passport.use('instructor-local', new localStrategy({
    usernameField: 'email'
}, function(email, password, done){
    let query = {email: email};
    InstructorModel.findOne(query, function(err, user){
        if(err) throw err
        if(!user){
            return done(null, false, {message: 'No User Found'});
        }
        if(!user.comparePassword(password)){
            return done(null, false);
        }
        return done(null, user);
    });
}));


passport.serializeUser(function(user, done) {
    key = {
        id: user.id,
        type: user.role
    }
    done(null, key);
});
  
passport.deserializeUser(function(key, done) {
    let model = key.type === '1' ? StudentModel : InstructorModel;
    model.findOne( {_id: key.id}, function(err, user) {
        done(err, user);
    });
});