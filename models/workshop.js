const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
    year:{
        type: Number,
        required: true
    },
    desc: []
});

const Workshop = mongoose.model('Workshop',workshopSchema);
module.exports = Workshop;