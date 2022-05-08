const mongoose = require('mongoose');
const  CourseSchema = new mongoose.Schema({

    courseName:{
        type:String
    },
    courseCode:{
        type:String,
        unique:true
    },
    desc: []
});



const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
