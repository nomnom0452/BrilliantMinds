const   express = require('express'),
        router = express.Router(),
        bcrypt = require('bcryptjs'),
        passport = require('passport');

        
let InstructorModel = require('../models/instructor-model');
let CourseModel = require('../models/course-model');
let HistoryModel = require('../models/history-model');
//instuctor login route

router.get('/login', function(req, res){
    res.render('instructor/login')
});

router.post('/login', function(req, res, next){
    passport.authenticate('instructor-local', {
        successRedirect: '/',
        failureRedirect: '/Instructor/login',
        failureFlash: true
    })(req, res, next);
});


//instructor register route
router.get('/register', function(req, res){
    res.render('instructor/register');
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
        res.render('instructor/register',{
            errors: errors
        });
    } 
    else {
        let newUser = new InstructorModel({
            username: name,
            email: email,
            password: password,
            role: '2' //instructor role
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
                        res.redirect('/instructor/login');
                    }
                });
            });
        });
    }
});

router.get('/history/add', function(req, res){
    res.render('instructor/add-history');
});

router.post('/history/add', function(req, res){
    let History = new HistoryModel({
        instructor: req.user._id,
        education: [{
            name: req.body.eduName,
            location: req.body.eduLocation,
            studySubject: req.body.studySubject,
            yearStart: Date.now(),
            yearEnd: Date.now(),
            gpa: req.body.gpa
        }],
        experience: [{
            company: req.body.company,
            role: req.body.role,
            yearStart: Date.now(),
            yearEnd: Date.now(),
            desc: req.body.desc
        }]
    });

    History.save(function(err){
        if (err) throw err;
        else
            res.redirect('/');
    });
});

router.get('/passwordChange', function(req, res){
    res.render('instructor/changePassword');
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
        res.render('instructor/changePassword',{
            errors: errors
        });
    } 
    else{

        InstructorModel.findById(req.user._id, function(err, usr){
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
                    InstructorModel.findByIdAndUpdate(req.user._id, usr, function(err, newusr){
                        if(err) throw err;
                        newusr.save(function(err){
                            if(err) throw err;
                            res.redirect('/instructor/profile');
                        });
                    });
                }
            }
        });
    }
});

router.get('/profile', function(req, res){
    if(req.user == null) {
        res.render('instructor/studentDetail', {
            isInstructor: false
        })
    }
    else{
        InstructorModel.findById(req.user._id, function(err, instructor){
            if(err) throw err;
            
            if(instructor == null){
                console.log(instructor)
                res.render('instructor/studentDetail', {
                    isInstructor: false
                });
            }
            else{
                if(instructor.role === '2'){
                    res.render('instructor/studentDetail', {
                        isInstructor: true
                    });
                }
            }

        });
    }
});

router.get('/:id', function(req, res){
    InstructorModel.findById(req.params.id, function(err, instructor){
        if(err) throw err;
        else{
            res.render('instructor/instructorDetail', {
                instructor: instructor
            });
        }
    });
});

module.exports = router;