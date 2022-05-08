const mongoose = require('mongoose');
const  ResearchSchema = new mongoose.Schema({

    year: {
        type:Number
    },
    info:[
        {
            desc: {
                type:String,
            },
            type:{
                type:String
            }
        }
    ]
});



const research = mongoose.model('Research', ResearchSchema);
module.exports = research;
