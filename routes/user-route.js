const express =require("express")
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../model/user");
const Withdraw =require('../model/withdraw')
const Receipt=require('../model/receipt')
const Notification=require('../model/notification');
const Fiat =require('../model/fiat')
const Ad=require('../model/ad');
const Point=require('../model/points')
const { Router } = require("express");


router.get('/notifications', (req, res) => {
    Notification.find({},(err,allNotifications)=>{
        if(err){ console.log(err)}
        else{
            res.json({notifications:allNotifications});
        }
         
    })
});

router.get('/ads',(req,res)=>{
    Ad.find({},(err,ad)=>{
        if(err){console.log(err)}
        else{
             res.json({ad:ad});
        }
    })
})


router.post('/:user/notify', (req, res) => {
        User.findOne({username:req.params.user},(err,user)=>{
            user.notice=false
            user.ip=req.headers['x-forwarded-for']
            user.save(()=>{
                if(err){
                    console.log(err);
                }else{
                    res.json(user);
                }
                 
            })
        })
});

router.post('/:user/withdraw',(req,res)=>{
    const userWithdrawal={
        paymentType:req.body.paymentType,
        paymentDate:Date.now(),
        amount:req.body.amount,
        address:req.body.address,
        user:req.params.user,
    }
    console.log(userWithdrawal)
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user==null){ res.json({err:"user does not exist"});}
        else{
            if(user.withdrawble<userWithdrawal.amount){
                 res.json({insufficient:true,user});
            }
            else if(user.withdrawble>=userWithdrawal.amount){
                user.withdrawble=Number(user.withdrawble)-Number(userWithdrawal.amount)
                user.ip=req.headers['x-forwarded-for']
                Withdraw.create(userWithdrawal,(err,withdraw)=>{
                    if(err){console.log(err)}
                    else{
                        console.log(withdraw)
                    }
                    })
                user.save((err)=>{
                    if(err){
                        res.json({insufficient:true,user})
                    }else{
                        
                        res.json({insufficient:false,user});
                    }
                    
                }) 
            }
        }
    })
})


router.post('/:user/fiat',(req,res)=>{
    const userFiat={
        accountName:req.body.accountName,
        amount:req.body.amount,
        accountNumber:req.body.accountNumber,
        bank:req.body.bank,
        user:req.params.user
    }
    console.log(userFiat)
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user==null){ res.json({err:"user does not exist"});}
        else{
            if(user.withdrawble<userFiat.amount){
                 res.json({insufficient:true,user});
            }
            else{
                user.withdrawble=Number(user.withdrawble)-Number(userFiat.amount)
                user.ip=req.headers['x-forwarded-for']
                Fiat.create(userFiat,(err,withdraw)=>{})
                user.save((err)=>{
                    if(err){
                        console.log(err)
                        res.json({insufficient:true,user})
                    }
                    else{
                    console.log(userFiat)
                    res.json({insufficient:false,user});}
                }) 
            }
        }
    })
})

router.post('/:user/point',(req,res)=>{
    const userAd={
        accountName:req.body.accountName,
        amount:req.body.amount,
        username:req.params.user
    }
    console.log(userAd)
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user==null){ res.json({err:"user does not exist"});}
        else{
            if(user.adPoint<userAd.amount){
                 res.json({insufficient:true,user});
            }
            else{
                user.adPoint=Number(user.adPoint)-Number(userAd.amount)
                user.ip=req.headers['x-forwarded-for']
                Point.create(userAd,(err,withdraw)=>{})
                user.save((err)=>{
                    if(err){
                        console.log(err)
                        res.json({insufficient:true,user})
                    }
                    else{
                    console.log(userAd)
                    res.json({insufficient:false,user});}
                }) 
            }
        }
    })
})



router.post('/:user/transfer',(req,res)=>{
    const amount=req.body.amount
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user==null){ res.json({err:"user does not exist"});}
        else{
            User.findOne({username:req.body.user},(err,recipient)=>{
                if(err||recipient==null||req.params.user==req.body.user){res.json({userFalse:true})}
                else{
                    if(user.deposit>=amount || user.withdrawble>=amount ){
                        Receipt.create({text:`${user.name} transferred ${amount} BTX to you.`},(err,recipientReceipt)=>{
                            if(user.deposit>=amount){
                                Receipt.create({text:`you transferred ${amount} BTX to ${recipient.name}.`},(err,userReceipt)=>{
                                    user.deposit=Number(user.deposit)-Number(amount)
                                    user.receipt.push(userReceipt)
                                    user.ip=req.headers['x-forwarded-for']
                                    user.save((err)=>{
                                        if(err){
                                            res.json({success:false})
                                        }else{
                                        res.json({success:true,user})
                                        recipient.deposit=Number(recipient.deposit)+Number(amount)
                                        recipient.receipt.push(recipientReceipt)
                                        recipient.save()}
                                    })
                                })
                                
                                
                            }else if(user.withdrawble>=amount){
                                Receipt.create({text:`you transferred ${amount} BTX to ${recipient.name}.`},(err,userReceipt)=>{
                                    user.receipt.push(userReceipt)
                                    user.withdrawble=Number(user.withdrawble)-Number(amount)
                                    user.ip=req.headers['x-forwarded-for']
                                    user.save(()=>{
                                        res.json({success:true,user})
                                        recipient.receipt.push(recipientReceipt)
                                        recipient.deposit=Number(recipient.deposit)+Number(amount)
                                        recipient.save()
                                    })
                                })
                            }
                        })
                        
                    }else{ res.json({success:false});}
                }
            })
        }
    }) 
})


router.post('/:user/ad',(req,res)=>{
    User.findOne({username:req.params.user},(err,user)=>{
        if(err){
            console.log("an error occured user-routes 144")
        }
        else{
            if(user.shared===false){
                user.adPoint=Number(user.adPoint)+20
                user.shared=true
                user.save(err=>{
                    if(err){console.log(err)}
                    
                    else{
                        console.log(user)
                         res.json({user})
                        }
                })

            }else{
                 res.json({user});
            }
        }
})
})

router.post('/:user/secret', (req, res) => {
    const secret=req.body.secretuser
    console.log(`your secret is ${secret}`)
    User.findOne({username:req.params.user},(err,user)=>{
        if(err){
             res.json({success:false});
        }else{
             user.secretCode=secret
             user.save((err)=>{
                 if(err){
                     console.log(err)
                    res.json({success:false})
                 }
                 else{
                     console.log(user.secret)
                    res.json({user})
                    
                 }
             })
        }
    })
});


module.exports=router  