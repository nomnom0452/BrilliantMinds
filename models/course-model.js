const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    name: String,
    instructor: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Instructor'
        },
        name: String
    },
    description: String,
    category: String,
    requirement: String, 
    picturePath: String,
    price: Number,
    rating: Number,
    voteCounter: Number
});


const CourseModel = module.exports = mongoose.model('Course', CourseSchema);