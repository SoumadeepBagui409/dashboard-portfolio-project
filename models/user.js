const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema({
    UserName:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tokens: [{
        token:{
            type:String
        }
    }]
});


UserSchema.statics.findByCred = async (UserName,password)=>{
           const user = await User.findOne({UserName:UserName});
       if(user.length==0){
           throw new error("not authenticated");
       }
       const isSame = await bcrypt.compare(password,user.password);
       if(!isSame){
            throw new error("not authenticated");
       }
       return user;
}

const User = mongoose.model('User',UserSchema);
module.exports = User;