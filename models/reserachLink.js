const mongoose = require('mongoose');
const  ResearchLinkSchema = new mongoose.Schema({

    publon:{
        type:String
    },
    scopus:{
        tpye:String
    },
    googleScholar:{
        type:String
    },
    DBPL:{
        type:String
    },
    orchid:{
        type:String
    }
});



const researchLink = mongoose.model('ResearchLink', ResearchLinkSchema);
module.exports = researchLink;
