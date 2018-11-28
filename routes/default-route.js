const   express = require('express'),
        router = express.Router();        

let CourseModel = require('../models/course-model');
let InstructorModel = require('../models/instructor-model');

// home route
router.get('/', function(req, res){
    InstructorModel.find({}, function(err, instructor){
        if(err) throw err;
        else {
            CourseModel.find({}, function(err, course){
                if(err) throw err;
                else{
                    let object = JSON.parse(JSON.stringify({instructor, course}));
                    res.render('home', {
                        obj: object
                    });
                }
            }).limit(5);
        }
    }).limit(5);
});

//register header route
router.get('/registerHeader', function(req, res){
    res.render('registerPage');
});

//login header route
router.get('/loginHeader', function(req, res){
    res.render('loginPage');
});

//logout router
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'logged out');
    res.redirect('loginHeader');
})

module.exports = router;