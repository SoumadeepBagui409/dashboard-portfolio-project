
const jwt = require('jsonwebtoken');
const token = async (user)=>{
  
     const token = jwt.sign({_id: user._id.toString()}, "InternProject");
    
         user.tokens.push({token});
         await user.save();
         return token;
}

module.exports = token;