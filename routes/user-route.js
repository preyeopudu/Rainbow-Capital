const express =require("express")
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../model/user");
const Withdraw =require('../model/withdraw')
const Receipt=require('../model/receipt')
const Notification=require('../model/notification');
const Fiat =require('../model/fiat')
const { Router } = require("express");


router.get('/notifications', (req, res) => {
    Notification.find({},(err,allNotifications)=>{
        if(err){ console.log(err)}
        else{
            res.json({notifications:allNotifications});
        }
         
    })
});


router.post('/:user/notify', (req, res) => {
        User.findOne({username:req.params.user},(err,user)=>{
            user.notice=false
            user.ip=req.ip
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
    
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user==null){ res.json({err:"user does not exist"});}
        else{
            if(user.withdrawble<userWithdrawal.amount){
                 res.json({insufficient:true,user});
            }
            else if(user.withdrawble>=userWithdrawal.amount){
                user.withdrawble=Number(user.withdrawble)-Number(userWithdrawal.amount)
                user.ip=req.ip
                Withdraw.create(userWithdrawal,(err,withdraw)=>{})
                user.save(()=>{
                    res.json({insufficient:false,user});
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
    
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user==null){ res.json({err:"user does not exist"});}
        else{
            if(user.withdrawble<userFiat.amount){
                 res.json({insufficient:true,user});
            }
            else{
                user.withdrawble=Number(user.withdrawble)-Number(userFiat.amount)
                user.ip=req.ip
                Fiat.create(userFiat,(err,withdraw)=>{})
                user.save(()=>{
                    res.json({insufficient:false,user});
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
                if(err||recipient==null||req.params.user===recipient){res.json({userFalse:true})}
                else{
                    if(user.deposit>=amount || user.withdrawble>=amount ){
                        Receipt.create({text:`${user.name} transferred ${amount} BTX to you.`},(err,recipientReceipt)=>{
                            if(user.deposit>=amount){
                                Receipt.create({text:`you transferred ${amount} BTX to ${recipient.name}.`},(err,userReceipt)=>{
                                    user.deposit=Number(user.deposit)-Number(amount)
                                    user.receipt.push(userReceipt)
                                    user.ip=req.ip
                                    user.save(()=>{
                                        res.json({success:true,user})
                                        recipient.deposit=Number(recipient.deposit)+Number(amount)
                                        recipient.receipt.push(recipientReceipt)
                                        recipient.save()
                                    })
                                })
                                
                                
                            }else if(user.withdrawble>=amount){
                                recipient.receipt.push(recipientReceipt)
                                recipient.deposit=Number(recipient.deposit)+Number(amount)
                                recipient.save()
                                Receipt.create({text:`you transferred ${amount} BTX to ${recipient.name}.`},(err,userReceipt)=>{
                                    user.receipt.push(userReceipt)
                                    user.withdrawble=Number(user.withdrawble)-Number(amount)
                                    user.ip=req.ip
                                    user.save(()=>{
                                        res.json({success:true,user})
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




module.exports = router  