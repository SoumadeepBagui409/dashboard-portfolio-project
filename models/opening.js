const mongoose = require('mongoose');
const  OpenSchema = new mongoose.Schema({
    project:String,
    level:String,
    status:String,
    LastDate:String,
    desc:[],
    link:String,
    
});



const Open = mongoose.model('Open', OpenSchema);
module.exports = Open;
