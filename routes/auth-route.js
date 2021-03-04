const express =require("express")
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const User =require('../model/user');
const Otp=require('../model/otp')
const nodemailer=require('nodemailer')


router.post('/auth/otp', (req, res) => {
    let otpcode= Math.floor((Math.random()*900000)+100000)
    let email=req.body.username
    console.log(`your email is ${email}`)
     Otp.create({code:otpcode},async(err,otp)=>{
        if(err){console.log(err)}
        else{
            let transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'splashdev20@gmail.com',
                    pass:'programmer8'
                }
            })

            let mailOptions={
                from:'billiontraderx@gmail.com',
                to:`${email}`,
                subject:'Billiontraderx OTP',
                text:`your signup code : ${otpcode}`
            }

            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log(error)
                     res.json({sent:false});
                }
                else{
                    console.log('Email sent :'+info.response)
                    res.json({sent:true})
                }
            })
            ;
            


            //  res.json({otp});
             console.log(otpcode)
        }
     })
});


router.post('/auth/check', (req,res) => {
    otpcode=req.body.code
    console.log(otpcode)
    console.log(req.body)
    Otp.findOneAndDelete({code:otpcode},(err,otp)=>{
        if(err || otp==null){
             res.json({activated:false});
        }
        else{
             res.json({activated:true});
        }
    })
}); 

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
        console.log(req.body)
        User.findOne({username:req.body.username},(err,founduser)=>{
            
            if(err||founduser===null){
                 res.json({success:false});
            }
            else{
                if(req.body.secret=== founduser.secretCode){
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
                }2
            }
        })
})



module.exports=router