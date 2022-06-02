if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require("path");
const public = path.join(__dirname,'public')
app.use(express.static(public));
const viewsPath = path.join(__dirname,'views')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Workshop = require('./models/workshop.js');
const Talks = require('./models/talk.js');
const Guidance = require('./models/guidance.js');
const Research = require('./models/reserach');
const ResearchLink = require('./models/reserachLink');
const Teach = require('./models/teaching.js');
const Course = require('./models/course');
const User = require('./models/user')
const dateConvert = require('./dateConversion');
const bcrypt = require('bcryptjs');
const auth = require('./Auth');
const logOut = require('./logoutShow');
const tokenise = require('./tokenise.js');
const { redirect } = require('express/lib/response');
const { find } = require('./models/workshop.js');
const cookieParser = require('cookie-parser'); 
const res = require('express/lib/response');
const { use } = require('express/lib/application');
app.set('view engine','ejs');
app.set('views',viewsPath);

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(methodOverride('_method'));
mongoose.connect(process.env.MONGODB_URL);


app.get('/',async(req,res)=>{
    res.redirect("/workshop");
})

// workShop sections
app.get('/workshop',async(req,res)=>{
    try{
        const workshop = await Workshop.find({});
        workshop.sort((a,b)=>{
            return b.year-a.year;
        })
        res.render("workshop",{workshop:workshop}); 
    }catch(err){
        res.send(err.message);
    }
})
// Workshop Add -> holistic view

app.get('/workshop/add',(req,res)=>{
    res.render("workshop-add");
})

// workshopp add post request for holistic view
app.post('/workshop/add',auth,async(req,res)=>{
    const {year,descp} = req.body;
    try{
        console.log(year);
        const work = await Workshop.find({year:parseInt(year)});
        if(work.length==0){
            const workshop = await Workshop({
                year:year,
                desc:[descp]
            });
            workshop.save();
        }
        res.redirect('/workshop');
    }catch(Err){
        res.send(Err.message);
    }
})
app.delete('/workshop/delete/:id',auth,async(req,res)=>{
    const {id} = req.params;
    try{ 
        await Workshop.findByIdAndDelete({_id:id});  
        res.redirect("/workshop");
    }catch(Err){
        res.send(Err.message);
    }

})
//workshop add according to year
app.get("/workshop/add/:id",(req,res)=>{
    const {id} = req.params;
    res.render("workshop-add-id",{id:id});
})

app.post("/workshop/add/:id",auth,async(req,res)=>{
    const {id} = req.params;
    const {descp} = req.body;  
    try{
        const workshop = await Workshop.find({_id:id});
        if(workshop.length){
            const work = await Workshop.findOne({_id:id});
            work.desc.unshift(descp);
            await work.save();
        }
        res.redirect('/workshop');
    }catch(err){
        res.send(err.message);
    }

})

app.get("/workshop/:id/:idx",async(req,res)=>{
    const {id,idx} = req.params;
    try{
        const workshop = await Workshop.find({_id:id});
        res.render("workshop-update-id",{workshop:workshop[0].desc[idx],id:id,idx:idx});
    }catch(err){
        res.send(err.message);
    }
   
})

app.post("/workshop/add/:id/:idx",auth,async(req,res)=>{
    const {id,idx} = req.params;
    const {descp} = req.body;
    console.log(req.body);
    try{
        const workshop = await Workshop.findOne({_id:id});
        workshop.desc[idx] = descp;
        await workshop.save();
        res.redirect("/workshop");
    }catch(err){
        res.send(err.message);
    }
})

app.delete("/workshop/delete/:id/:idx",auth,async(req,res)=>{
    const {id,idx} = req.params;
    try{
        const workshop = await Workshop.findOne({_id:id});
        let valer = -1;
        workshop.desc = workshop.desc.filter((value)=>{
            valer++;
            return valer!=parseInt(idx);
            
        })
        await workshop.save();
        res.redirect("/workshop");
    }catch(err){
        res.send(err.message);
    }
})







// invited talks


app.get('/talks',async(req,res)=>{
    try{
        const talks = await Talks.find({});
        talks.sort((a,b)=>{
            return b.year-a.year;
        })
        res.render("talks/talks",{talks:talks});
    }catch(err){
        res.send(err.messaage);
    }
    
})

app.get("/talk/add/:id",(req,res)=>{
    const {id} = req.params;
    res.render("talks/talk-add",{id:id});
})

app.post("/talk/add/data/:id",auth,async(req,res)=>{
    const {id} = req.params;
    const {title,place,date} = req.body;
    let dateCurr  = date.split("-");
    dateCurr.reverse()
    let FinalDate = "";
    for(let i = 0;i<dateCurr.length;i++){
        FinalDate+=dateCurr[i]
        if(i!=2)FinalDate+="/";
    }
   try{
       const  talk = await Talks.findOne({_id:id});
       talk.info.unshift({
           title:title,
           place:place,
           date:FinalDate
       });
       await talk.save();
   }catch(err){
       res.send(err);
   }
    res.redirect("/talks");
});


app.post("/talk/delete/:id",auth,async(req,res)=>{
    const {id} = req.params;
    await Talks.findByIdAndDelete({_id:id});
    res.redirect("/talks");
})


app.get("/talk/add",(req,res)=>{
    res.render("talks/talk-add-new");
})

app.post("/talk/add/dataNew",auth,async(req,res)=>{
        const {year,title,date,place} = req.body;
        try{
            const talk = await Talks.findOne({year:year});
            await Talks.create({
                year:parseInt(year),
                info:[
                    {
                        title:title,
                        place:place,
                        date:date
                    }
                ]
            })
            console.log(talk);
        }catch(err){
            res.send(err.message);
        }
        res.redirect("/talks");
})
app.delete("/talk/delete/:id/:idx",auth,async(req,res)=>{
    const {id,idx} = req.params;
    try{
        const talk = await Talks.findOne({_id:id});
        talk.info = talk.info.filter((ele)=>{
            return ele._id!=idx;
        });

        await talk.save();
        res.redirect("/talks");
    }catch(err){
        res.send(err.message);
    }

})
app.get("/talk/update/:id/:idx",async(req,res)=>{
    const {id,idx} = req.params;
    try{
        const talk = await Talks.findOne({_id:id});
        const inform = talk.info.filter((ele)=>{
            return ele._id==idx;
        })
        res.render("talks/talk-update",{detail:inform[0],id:id,idx:idx});
    }catch(err){
        res.send(err.message);
    }
})
app.post("/talk/update/data/:id/:idx",auth,async(req,res)=>{
    const {id,idx} = req.params;
    const {title,date,place} = req.body;
    try{
        const talk = await Talks.findOne({_id:id});
        for(let i = 0;i<talk.info.length;i++){
            if(talk.info[i]._id==idx){
                let dateCurr  = date.split("-");
                dateCurr.reverse()
                let FinalDate = "";
                for(let i = 0;i<dateCurr.length;i++){
                         FinalDate+=dateCurr[i]
                         if(i!=2)FinalDate+="/";
                }
                talk.info[i].title = title;
                talk.info[i].place =place;
                talk.info[i].date = FinalDate;
            }
        }
        await talk.save();
        res.redirect("/talks");
    }catch(Err){
        res.send(Err.message);
    }

})




















app.get("/guidance",async(req,res)=>{
    try{
        const guidance = await Guidance.find({});
        res.render("guidance/guidance",{guidance:guidance});
    }catch(err){
        res.send(err.message);
    }
})

app.get("/guidance/add/:id",async(req,res)=>{
    const {id} = req.params;
         const guide = await Guidance.find({_id:id});
         let intern = false;
         if(guide[0].degree=="intern")intern = true;
        res.render("guidance/guidance-add",{guide:guide,id:id,update:false,intern:intern});

   
})


app.post("/guidance/add/:id",auth,async(req,res)=>{
    const {id} = req.params;
    try{
        const guide = await Guidance.findOne({_id:id});
        guide.info.unshift(req.body);
        await guide.save();
        res.redirect("/guidance");
    }catch(err){
        res.send(err.message);
    }
})

app.get("/guidance/update/:id/:idx",auth,async(req,res)=>{
    const {id,idx} = req.params;
    try{
        const guide = await Guidance.find({_id:id});
      
        let intern = false;
        if(guide[0].degree=="intern")intern = true;

        let guide1 = guide[0].info;
        guide1 = guide[0].info.filter((ele)=>{
            return ele._id==idx;
        })
         
         res.render("guidance/guidance-add",{guide:guide1,id:id,update:true,idx:idx,intern:intern});
    }catch(err){

    }
    
})

app.post("/guidance/update/:id/:idx",auth,async(req,res)=>{
    const {id,idx} = req.params;
    const {name,title,time,project,duration,affiliation,status} = req.body;
    let finalTime = dateConvert(time);
    try{
    const guide = await Guidance.findOne({_id:id});

    for(let i = 0; i<guide.info.length;i++){
        if(guide.info[i]._id==idx){
        guide.info[i].name = name;
        guide.info[i].time = finalTime;
        guide.info[i].title = title;
        guide.info[i].project = project;
        guide.info[i].duration = duration;
        if(guide.degree!="intern"){
        guide.info[i].affiliation = affiliation;
        guide.info[i].status = status;
        }
        }
    }
    await guide.save();
    res.redirect("/guidance");
    }catch(err){
        res.send(err.message);
    }
})

app.delete("/guidance/delete/:id/:idx",auth,async(req,res)=>{
   const {id,idx} = req.params;
    try{
        const  guide = await Guidance.findOne({_id:id});
        guide.info = guide.info.filter((ele)=>{
            return ele._id!=idx;
        })
        await guide.save();
        res.redirect("/guidance");
    }catch(err){
        res.send(err.message);
    }
})



















app.get("/reserach",async(req,res)=>{
    try{
        const link = await ResearchLink.find({});
        const research = await Research.find({}).sort({year:-1});
        res.render("research/research",{link:link,research:research});
    }catch(err){
        res.send(err.message);
    }
    
})



app.get("/researchLink/edit",async(req,res)=>{
    try{
        const link = await ResearchLink.find({});
        res.render("research/researchUpdate",{link:link});
    }catch(err){
        res.send(err.message);
    }
})



app.post("/researchLink/update",auth,async(req,res)=>{
    console.log(req.body);
    const {publon, googleScholar, DBPL, orchid} = req.body;
    try{
        const link = await ResearchLink.find({});
        link[0].publon = publon;
        link[0].googleScholar = googleScholar;
        link[0].DBPL = DBPL;
        link[0].orchid = orchid;
        await link[0].save();
        res.redirect('/reserach');
    }catch(err){
        res.send(err.message);
    }
})

app.get("/research/add/:id",auth,(req,res)=>{
    const {id} = req.params;
    res.render("research/researchAdd.ejs",{id:id});
})



app.post("/research/add/:id",auth,async(req,res)=>{
    try{
        const {id} = req.params;
        const {desc,type} = req.body;
        const resh = await Research.findOne({_id:id});
        resh.info.unshift({desc:desc,type:type});
        await resh.save();
        res.redirect("/reserach");
    }catch(err){
        res.send(err.message);
    }

})
app.delete("/research/delete/:id",auth,async(req,res)=>{
    try{
        const {id} = req.params;
        await Research.findByIdAndDelete({_id:id});
        res.redirect('/reserach');
    }catch(err){
        res.send(err.message);
    }
})

app.get("/research/dataInsert",(req,res)=>{
    res.render("research/researchDatainsert");
})
app.post("/research/dataInside",auth,async(req,res)=>{
    console.log(req.body);
    const {year,desc,type} = req.body;
    try{
       const checker = await Research.find({year:year});
        if(checker.length>0){
            res.send("already present");
        }else{
            await Research.create({
                year: parseInt(year),
                info:[]
            });
            const resh = await Research.find({year:year});
            resh[0].info.push({
                desc:desc,
                type:type
            })
            await resh[0].save();
            res.redirect('/reserach');
        }
    }catch(err){
        res.send(err.message);
    }
   
})
app.get("/research/update/:id/:idx",async(req,res)=>{
    try{
        const {id,idx} = req.params;
        const resh = await Research.findOne({_id:id});
        //console.log(resh);
        const send = resh.info.filter((msg)=>{
            return msg._id==idx;
        })
        res.render("research/researchUpdateIndi",{id:id,idx:idx,value:send});
    }catch(err){
        res.send(err.message);
    }
})

app.patch("/research/add/:id/:idx",auth,async(req,res)=>{
    try{
        const {id,idx} = req.params;
        const {desc,type} = req.body;
        const resh = await Research.findOne({_id:id});
        for(let i = 0 ;i<resh.info.length;i++){
            if(resh.info[i]._id==idx){
                resh.info[i].desc = desc
                resh.info[i].type = type 
            }
        }
        await resh.save();
        res.redirect('/reserach');  
    }catch(err){
        res.send(err.message);
    }
})

app.delete("/research/delete/:id/:idx",auth,async(req,res)=>{
    const {id,idx} = req.params;
    try{
        const resh = await Research.find({_id:id});
        resh[0].info = resh[0].info.filter((err)=>{
            return err._id!=idx;
        });
        await resh[0].save();
        res.redirect('/reserach'); 
    }catch(err){
        res.send(err.message);
    }
})
















app.get("/teaching",async(req,res)=>{
    try{
        let teach = await Teach.find({});
        const course = await Course.find({});
        teach = teach.sort((a,b)=>{
            return b.year-a.year;
        });
        res.render("teaching/teaching",{teach:teach,course:course});
    }catch(err){
        res.send(err.message);
    }

})

app.get("/teaching/add/data",async(req,res)=>{
    try{
        const course = await Course.find({});
        let CourseArr = [];
        for(let crs of course){
            CourseArr.push(crs.courseCode);
        }
        res.render("teaching/teachingAdd",{CourseArr:CourseArr});
    }catch(err){
        res.send(err.message);
    }
        
})

app.post("/teaching/add/data",auth,async(req,res)=>{
    try{
        const {year,status,semester,level,courseCode,courseName,courseLink} = req.body;
        const tech = await Teach.find({year:year});
        if(tech.length==0){
            await Teach.create({
                year:parseInt(year),
                info:[]
            });
            const techee = await Teach.findOne({year:year})
            techee.info.push({
                status: status,
                semester:semester,
                courseCode:courseCode,
                courseName:courseName,
                level:level,
                courseLink:courseLink
            })
            await techee.save();
            res.redirect("/teaching");
        }else{
            res.send("Already present");
        }
 
    }catch(err){
        res.send(err.message);
    }
})

app.delete("/teaching/delete/:id",auth,async(req,res)=>{
    const {id} = req.params;
    try{
        await Teach.findByIdAndDelete({_id:id});
        res.redirect("/teaching");

    }catch(err){
        res.send(err.message);  
    }
})
app.get("/teaching/add/:id",async(req,res)=>{
    try{
        const course = await Course.find({});
        let CourseArr = [];
        for(let crs of course){
            CourseArr.push(crs.courseCode);
        }
        const {id} = req.params;
        res.render("teaching/teachingAdder",{id:id,CourseArr:CourseArr});
    }catch(err){
        res.send(err.message);
    }

})
app.post("/teaching/addData/:id",auth,async(req,res)=>{
    const {id} = req.params;
    try{
        const finder = await Teach.findOne({_id:id});
        
        finder.info.unshift(req.body);
        await finder.save();
        res.redirect("/teaching");
    }catch(err){
        res.send(err.message);
    }
})

app.delete("/teaching/deleteIt/:id/:idx",auth,async(req,res)=>{
    try{
        const {id,idx} = req.params;
        const  teach = await Teach.findOne({_id:id});
        teach.info = teach.info.filter((ele)=>{
            return ele.id!=idx;
        })
        await teach.save();
        res.redirect("/teaching");
    }catch(Err){
        res.send(Err.message);
    }
})

app.get("/teaching/update/:id/:idx",async(req,res)=>{
    try{
        const course = await Course.find({});
        let CourseArr = [];
        for(let crs of course){
            CourseArr.push(crs.courseCode);
        }
        const {id,idx} = req.params;
        const teach = await Teach.findOne({_id:id});
        let data = teach.info.filter((ele)=>{
            return ele._id==idx;
        })
        res.render("teaching/teacingUpdate",{id:id,idx:idx,data:data,CourseArr:CourseArr});
    }catch(err){
        res.send(err.message);
    }
})

app.patch("/teaching/update/:id/:idx",auth,async(req,res)=>{
    try{
        const {id,idx} = req.params;
        const teach = await Teach.findOne({_id:id});
        for(let tch of teach.info){
            if(tch._id==idx){
                const {status,semester,courseCode,courseName,level,courseLink} = req.body;

                tch.status = status
                tch.semester = semester
                tch.courseCode = courseCode
                tch.courseName = courseName
                tch.level = level
                tch.courseLink = courseLink
            }
        }
        await teach.save();
        res.redirect("/teaching");
    }catch(Err){
        res.send(Err.message);
    }
})

app.get("/course/add",(req,res)=>{
        res.render("course/course");

})
app.post("/course/add/data",auth,async(req,res)=>{
    try{
        const {courseName,courseCode,desc} = req.body;
        const descrip = desc.split("\r");
        await Course.create({
            courseName:courseName,
            courseCode:courseCode,
            desc:descrip
        })
        res.redirect("/teaching");
    }catch(Err){
        res.render(Err.message);
    }
})
app.delete("/course/delete/:id",auth,async(req,res)=>{
    try{    
        const {id} = req.params;
        await Course.findByIdAndDelete({_id:id});
        res.redirect("/teaching");
    }catch(err){
        res.send(err.message);
    }
})
app.get("/course/update/:id",async(req,res)=>{
    try{    
        const {id} = req.params;
        const data = await Course.findOne({_id:id});
        res.render("course/courseUpdate",{id:id,data:data});
    }catch(err){
        res.send(err.message);
    }
})

app.patch("/course/update/:id",auth,async(req,res)=>{
    try{
        const {id} = req.params;
        const course = await Course.findOne({_id:id});
        const {courseName,courseCode,desc} = req.body;
        const descrip = desc.split("\r");
        course.courseName = courseName
        course.courseCode = courseCode
        course.desc = descrip;
        await course.save();
        res.redirect("/teaching");
    }catch(err){
        res.send(err.message);
    }
})



















app.get("/opening",(req,res)=>{
    res.render("opening/opening");
})

app.get("/opening/addData",(req,res)=>{
    res.render("opening/openingAdd");
})


app.post("/opening/add/data",auth,async(req,res)=>{
    const {project,level,status,LastDate,desc,link} = req.body;
    const date = dateConvert(LastDate);
    const descrip = desc.split("\r");
    try{    
        console.log(project,level,status,date,descrip,link);
    }catch(err){
        console.log(err.message);
    }
})





















app.get("/login",(kreq,res)=>{
        res.render("user/login"); 
})
app.post("/login",async(req,res)=>{
    try{
        const {UserName,password} = req.body;
        console.log(UserName,password)
        const user = await User.findByCred(UserName,password);
         const token = await tokenise(user);
         res.cookie("jwt",token,{
             expires:new Date(Date.now()+604800000),
             httpOnly:true
         })
        res.redirect('/');
    }catch(err){
        res.send(err.message);
    }
})

app.get('/logout',auth,async(req,res)=>{
    try{
        const user = req.user;
        const token = req.token;
        user.tokens = user.tokens.filter((ele)=>{
            return ele.token!=token;
        })
        res.clearCookie('jwt');
        await user.save();
        res.redirect('/login');
    }catch(err){
        res.send(err.message);
    }
})

app.listen(process.env.PORT || 3001,()=>{
    console.log("server");
})


