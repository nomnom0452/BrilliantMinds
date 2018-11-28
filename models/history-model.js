const mongoose = require('mongoose');

const HistorySchema = mongoose.Schema({
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    },
    education: [{
        name: String,
        location: String,
        studySubject: String,
        yearStart: Date,
        yearEnd: Date,
        gpa: Number
    }],
    experience: [{
        company: String,
        role: String,
        yearStart: Date,
        yearEnd: Date,
        desc: String
    }]
});

const HistoryModel = module.exports = mongoose.model('History', HistorySchema);