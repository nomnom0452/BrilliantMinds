const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

const InstructorSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type:String,
        require: true
    },
    picturePath: {
        type: String,
    },
    location: String,
    status: String,
    desc: String,
    role: {
        type: String,
        require: true
    },
    course: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        name: String,
        price: Number
    },
    rating: Number,
    history: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'History'
    }
});

InstructorSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

InstructorSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

const InstructorModel = module.exports = mongoose.model('Instructor', InstructorSchema);