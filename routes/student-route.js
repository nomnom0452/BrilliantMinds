const   express = require('express'),
        router = express.Router(),
        bcrypt = require('bcryptjs'),
        passport = require('passport');

        
let StudentModel = require('../models/student-model');

//student login route
router.get('/login', function(req, res){
    res.render('student/login');
});

router.post('/login', function(req, res, next){
    passport.authenticate('student-local', {
        successRedirect: '/',
        failureRedirect: '/student/login',
        failureFlash: true
    })(req, res, next);
});


//student register route

router.get('/register', function(req, res){
    res.render('student/register');
});

router.post('/register', function(req, res){
    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.passwordConf;

    req.check(name).isEmpty().withMessage('Username is required');
    req.check(email).isEmpty().withMessage('email is required');
    req.check('email').isEmail().withMessage('email invalid');
    req.check(password).isEmpty().withMessage('password is required');
    req.check('passwordConf').equals(req.body.passwordConf).withMessage('password do not match');

    let errors = req.validationErrors();

    if(errors){
        res.render('student/register',{
            errors: errors
        });
    } 
    else {
        let newUser = new StudentModel({
            username: name,
            email: email,
            password: password,
            role: '1'
        });

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err) console.log('err');
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return
                    }
                    else{
                        req.flash('success', 'Registered, please log in');
                        res.redirect('/student/login');
                    }
                });
            });
        });
    }
});

router.get('/passwordChange', function(req, res){
    res.render('student/changePassword');
});

router.post('/passwordChange', function(req, res){
    let nPass = req.body.newPassword;
    let oPass = req.body.oldPassword;
    let cPass = req.body.ConfPassword;

    req.check(oPass).isEmpty().withMessage('Old password is required');
    req.check(nPass).isEmpty().withMessage('New password is required');
    req.check('newPassword').equals(req.body.ConfPassword).withMessage('new password do not match');

    let errors = req.validationErrors();
    if(errors){
        res.render('student/changePassword',{
            errors: errors
        });
    } 
    else{

        StudentModel.findById(req.user._id, function(err, usr){
            if(err) throw err;
            if(usr == null){
                res.render('/');
            }
            else{
                if(!bcrypt.compareSync(oPass, usr.password)){
                    console.log('password not same as old ones')
                        res.render('student/changePassword',{
                        errors: 'Password error'
                    });
                }
                else{
                    usr.password = bcrypt.hashSync(nPass);
                    StudentModel.findByIdAndUpdate(req.user._id, usr, function(err, newusr){
                        if(err) throw err;
                        newusr.save(function(err){
                            if(err) throw err;
                            res.redirect('/student/profile');
                        });
                    });
                }
            }
        });
    }
});

router.get('/profile', function(req, res){
    if(req.user == null) {
        res.render('student/login');
    }
    else{
        StudentModel.findById(req.user._id, function(err, usr){
            if(err) throw err;
            if(usr == null){
                res.render('student/login');
            }
            else{
                res.render('student/profile', {
                    name: usr.username
                });
            }
        });
    }   
});

router.get('/enroll', function(req, res){
    if(req.user == null) {
        res.render('student/login');
    }
    else{
        StudentModel.findById(req.user._id, function(err, usr){
            if(err) throw err;
            if(usr == null){
                res.render('/home');
            }
            else{
                res.render('profile', {
                    isEnrolled: true,
                    name: usr.username
                });
            }
        });
    }
});

module.exports = router;