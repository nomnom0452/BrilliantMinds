const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

const StudentSchema = mongoose.Schema({
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
    role: {
        type: String,
        require: true
    }
});

StudentSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

StudentSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

const StudentModel = module.exports = mongoose.model('Student', StudentSchema);
