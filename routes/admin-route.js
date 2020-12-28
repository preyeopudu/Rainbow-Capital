const express =require("express")
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const User =require('../model/user');
const Withdraw =require('../model/withdraw')
const Notification=require('../model/notification');
const Receipt=require('../model/receipt');
const Fiat =require('../model/fiat')


// User.register(new User({username:"admin"}),"@Billiontraderx2020")

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
    req.flash("success","successfully logged out")
     res.redirect('/admin/login');
})

router.post('/admin/login',passport.authenticate("local",{
    failureRedirect:"/admin/login"
}), (req, res) => {
    req.flash("success","welcome back")
    res.redirect('/transfer')
});

router.get('/',(req,res)=>{
    res.render('home');
})


router.get('/admin/notifications',isAdmin,(req,res)=>{
    res.render('notification');
})


router.post('/admin/notifications',isAdmin,(req,res)=>{
    User.update({"notice":false}, {"$set":{"notice": true}}, {"multi": true}, (err, writeResult) => {});
    Notification.create({title:req.body.title,text:req.body.text},(err,notification)=>{
        if(err){
            console.log(err)
        }else{
            req.flash("success","Notification has been sent")
             res.redirect('/admin/notifications')
        }
    })
})


router.get('/transfer',isAdmin,(req,res)=>{
    res.render('transfer');
})

router.get('/reset',isAdmin,(req,res)=>{
    res.render('reset');
})


router.post('/admin/reset',isAdmin,(req,res)=>{
        User.findOne({username:req.body.username},(err,founduser)=>{
            if(err||founduser===null){
                req.flash("error","User does not exist")
                 res.redirect('/reset');
            }
            else{
                    founduser.setPassword(req.body.password,(err)=>{
                        if(err){
                            req.flash("error","failed to reset please retry")
                            res.redirect('/reset');
                            
                        }
                        else{
                            founduser.save(()=>{
                                req.flash("success","Reset Successful")
                                res.redirect('/reset');
                               
                            })
                             
                        }
                    })
            }
        })
})


router.post('/transfer',isAdmin,(req,res)=>{
  
    User.findOne({username:req.body.email},(err,user)=>{
        if(err || user == null){
            req.flash("error","User does not exist")
             res.redirect('/transfer');
        }
        else{
            user.deposit=Number(user.deposit)+Number(req.body.amount)
            Receipt.create({text:`Admin transferred ${req.body.amount}BTX to you `},(err,sent)=>{
                user.receipt.push(sent)
                user.save((err)=>{
                    if(err){}else{
                        req.flash("success",`BTX successfully transfered`)
                        res.redirect('/transfer');
                    }
                })
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
             res.render('withdrawal',{withdrawals:withdrawals,type:"Bitcoin"});;
        }
    })
})

router.get('/Ethereum',isAdmin,(req,res)=>{
    Withdraw.find({paymentType:"Ethereum"},(err,withdrawals)=>{
        if(err){
            console.log(err)
        }else{
             res.render('withdrawal',{withdrawals:withdrawals,type:"Ethereum"});;
        }
    })
})

router.get('/fiat',isAdmin,(req,res)=>{
    Fiat.find({},(err,fiats)=>{
        if(err){
            console.log(err)
        }else{
             res.render('fiat',{fiats:fiats});;
        }
    })
})

router.post('/transfer/fiat/:id', (req, res) => {
    Fiat.findByIdAndDelete(req.params.id,(err)=>{
        if(err){ res.json({error:err});}
        else{
              res.redirect('/fiat');
        }
    })
    // Fiat.findByIdAndDelete(req.params.id,(err)=>{
    //     if(err){
    //         console.log(err)
    //     }else{
    //          res.redirect('/fiat');
    //     }
    // })
});

router.post('/transfer/:coin/:id',isAdmin,(req,res)=>{

    Withdraw.findByIdAndDelete(req.params.id,(err)=>{
            if(err){ console.log(err)}
            else{
                  res.redirect(`/${req.params.coin}`);;
            }
    })
    // Withdraw.findOneAndRemove({_id:req.params.id},(err)=>{
    //     if(err){
    //         console.log(err)
    //     }else{
    //            res.redirect(`/${req.params.coin}`);
    //     }
    // })
})


module.exports=router