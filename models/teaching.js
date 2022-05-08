const mongoose = require('mongoose');

const teachingSchema = new mongoose.Schema({
   year:{
       type:Number
   },
   info:[
       {
        status:{
            type:String
        },
        semester:{
            type:String
        },
        courseCode:{
            type:String
        },
        courseName:{
            type:String
        },
        level:{
            type:String
        },
        courseLink:{
            type:String
        }
       }
   ]
});

const teaching = mongoose.model('Teaching',teachingSchema);
module.exports = teaching;
