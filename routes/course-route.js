const   express = require('express'),
        router = express.Router();
    
let CourseModel = require('../models/course-model');
let InstructorModel = require('../models/instructor-model');

router.get('/add', function(req, res){
    res.render('course/add-course');
});

router.post('/', function(req, res) {
    CourseModel.create(req.body.course, (err, createdCourse) => {
        if (err) {
            res.redirect("/");
        } else {
            InstructorModel.findById(req.user.id, (err, user) => {
                if (err) res.redirect("/course/add");
                else {
                    createdCourse.instructor.id = req.user._id;
                    createdCourse.instructor.name = req.user.username;
                    createdCourse.save();

                    res.redirect("/");
                }
            })
        }
    });
});

router.get('/:id', function(req, res){
    CourseModel.findById(req.params.id, function(err, course){
        if(err) throw err;
        
        res.render('course/courseDetail', {course});
    });
});


module.exports = router;