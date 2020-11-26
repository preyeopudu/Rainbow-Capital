const express =require("express")
var cors = require('cors');
const app = express()

const mongoose = require('mongoose');
app.use(cors())


const uri = 'mongodb+srv://opudupreye:5gr3gF4YVD5F6K2b@billiontraderx.bxlns.mongodb.net/<billiontraderx>?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true,useUnifiedTopology: true})
.then(() => {
  console.log('MongoDB Connected…')
})
.catch(err => console.log(err))


// mongoose.connect('mongodb://localhost:27017/btx', {useNewUrlParser: true, useUnifiedTopology: true});
const stackRoutes= require('./routes/stack-route')
const authRoutes=require('./routes/auth-route')
const adminRoutes=require('./routes/admin-route')
const userRoutes=require('./routes/user-route')
const Stack=require('./model/stack')
const Receipt=require('./model/receipt')
const User =require('./model/user');
const bodyParser=require('body-parser')
const passport=require('passport')
const flash=require('connect-flash')
const LocalStrategy=require('passport-local')
const passportLocalMongoose=require('passport-local-mongoose')
const Withdraw =require('./model/withdraw')


app.set('view engine', 'ejs');
app.use(flash())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(require('express-session')({
    secret:"Billion Traderx",
    resave:false,
    saveUninitialized:false
}))
app.use(bodyParser.json());
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// user.remove({},(err)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log("success")
//     }
// })

// Withdraw.remove({},(err)=>{
//     if(err){console.log()}
// })

app.use(function(req,res,next){
    res.locals.error=req.flash("error")
    res.locals.success=req.flash('success')
    next()
})


app.use(authRoutes,cors());
app.use(stackRoutes,cors());
app.use(adminRoutes,cors());
app.use(userRoutes,cors());

app.get('/:user', (req, res) => {
    const founduser =req.params.user
    User.findOne({username:founduser},(err,user)=>{
        if(err || user == null){
             res.json({
                 err:"user does not exist"
             });
        }

        else{
            const userStack=user.stack
            ///check if user is currently on a plan //
             if(userStack.length>0){
                const today= new Date ()
                const matureDate=userStack[0].matureDate
                 if(today >= matureDate){
                     Stack.findOneAndDelete({_id:userStack[0]._id},(err)=>{
                         user.withdrawble=user.withdrawble+userStack[0].return
                         user.stack.pop()
                         user.save((err)=>{
                             if(err){
                                  res.json({message:"not saved"});
                             }
                             else{
                                 console.log(user.withdrawble);
                                 res.json({stack:true,user:user})
                             }
                         })
                     })
                 }else{
                    res.json({stack:true,user:user})
                 }
             }

             else{
                  res.json({
                      stack:false,
                      user:user
                  });
             }
        }
    })

});





port=process.env.PORT||5000
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});