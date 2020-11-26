const express =require("express")
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const User =require('../model/user');
const Withdraw =require('../model/withdraw')
const Notification=require('../model/notification');


User.register(new User({username:"admin"}),"@Billiontraderx2020")

function isAdmin(req,res,next){
    if(req.isAuthenticated()&&req.user.username=="admin"){
        return next()
    }
     res.redirect('/admin/login');
}

router.get('/admin/login', (req, res) => {
    res.render('login');
});

router.get('/admin/logout',(req,res)=>{
    req.logOut()
     res.redirect('/admin/login');
})

router.post('/admin/login',passport.authenticate("local",{
    successRedirect:"/transfer",
    failureRedirect:"/admin/login"
}), (req, res) => {
    
});

router.get('/',(req,res)=>{
    res.render('home');
})


router.get('/admin/notifications',isAdmin,(req,res)=>{
    res.render('notification');
})
router.post('/admin/notifications',isAdmin,(req,res)=>{
    Notification.create({title:req.body.title,text:req.body.text},(err,notification)=>{
        if(err){
            console.log(err)
        }else{
            req.flash("success","Notification has been sent")
             res.redirect('/admin/notifications')
            console.log(notification)
        }
    })
})


router.get('/transfer',isAdmin,(req,res)=>{
    res.render('transfer');
})


router.post('/transfer',isAdmin,(req,res)=>{
  
    User.findOne({username:req.body.email},(err,user)=>{
        if(err || user == null){
            req.flash("error","User does not exist")
             res.redirect('/transfer');
        }
        else{
            user.deposit=Number(user.deposit)+Number(req.body.amount)
            user.save((err)=>{
                if(err){}else{
                    req.flash("success","BTX successfully transfered")
                    res.redirect('/transfer');
                }
            })
             ;
        }
    })
})

router.get('/Bitcoin',isAdmin,(req,res)=>{
    Withdraw.find({paymentType:"Bitcoin"},(err,withdrawals)=>{
        if(err){
            console.log(err)
        }else{
             res.render('withdrawal',{withdrawals:withdrawals});;
        }
    })
})

router.get('/Ethereum',isAdmin,(req,res)=>{
    Withdraw.find({paymentType:"Ethereum"},(err,withdrawals)=>{
        if(err){
            console.log(err)
        }else{
             res.render('withdrawal',{withdrawals:withdrawals});;
        }
    })
})

router.get('/Tron',isAdmin,(req,res)=>{
    Withdraw.find({paymentType:"Tron"},(err,withdrawals)=>{
        if(err){
            console.log(err)
        }else{
             res.render('withdrawal',{withdrawals:withdrawals});;
        }
    })
})

router.post('/transfer/:coin/:id',isAdmin,(req,res)=>{
    Withdraw.findOneAndRemove({_id:req.params.id},(err)=>{
        if(err){
            console.log(err)
        }else{
               res.redirect(`/${req.params.coin}`);
        }
    })
})


module.exports=router