const mongoose = require('mongoose');

const TalkSchema = mongoose.Schema({
    year:Number,
    info:[
        {
            title:String,
            place:{
                type:String,
                default: ""
            },
            date:{
                type:String,
                default: ""
            }
        }
    ]
});

const Talk = mongoose.model("Talk",TalkSchema);
module.exports= Talk;