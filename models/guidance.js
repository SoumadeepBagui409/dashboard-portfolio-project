const mongoose = require('mongoose');

const guidanceSchema = new mongoose.Schema({
    degree:{
        type:String
    },
    info:[
        {
            name:{
                type:String
            },
            title:{
                type:String
            },
            time:{
                type:String
            },
            project:{
                type:String,
            },
            duration:{
                type:String
            },
            affiliation:{
                type:String
            },
            status:{
                type:String
            }
        }
    ]
});

const Guidance = mongoose.model('Guidance',guidanceSchema);
module.exports = Guidance;