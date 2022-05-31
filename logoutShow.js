const jwt = require('jsonwebtoken');
const User = require('./models/user');
const auth = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verified = jwt.verify(token,"InternProject");
        const user = await User.findOne({_id:verified._id,'tokens.token':token});
        if(!user){
            throw new error();
        }
        next();
    }catch(err){
        res.send("you are laready logged in")
    }
}

module.exports = auth;