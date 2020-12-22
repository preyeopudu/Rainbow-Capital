const express =require("express")
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const User =require('../model/user');


router.post('/auth/signup',(req,res)=>{
    const newUser={username:req.body.username,name:req.body.name,secret:req.body.secret,referee:req.body.refree,ip:req.ip}
     

    User.register(new User(newUser),req.body.password,(err,user)=>{
        if(err){
             return res.json({err});
        }
        
            passport.authenticate("local")(req,res,()=>{
                res.json({
                    auth:true,
                    message:"Succesfully Signed Up",
                    user : req.user
                })
           })
          
        
    })

    


})  


router.post('/auth/signin',passport.authenticate("local"),(req,res)=>{
    res.json({
        auth:true,
        message:"Succesfully Signed Up",
        user : req.user
    })
})


router.post('/auth/logout', (req, res) => {
    req.logout(()=>{
        
    })
     res.json({
         auth:false
     });
});

router.post('/auth/reset',async (req,res)=>{
        


        User.findOne({username:req.body.username},(err,founduser)=>{
            if(err||founduser===null){
                 res.json({success:false});
            }
            else{
                if(req.body.secret=== founduser.secret){
                    founduser.setPassword(req.body.password,(err)=>{
                        if(err){
                             res.json({success:false});
                        }
                        else{
                            founduser.save()
                             res.json({success:true})
                        }
                    })
                }
                else{
                     res.json({success:false});
                }
            }
        })
})



module.exports=router