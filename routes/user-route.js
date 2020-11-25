const express =require("express")
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../model/user");
const Withdraw =require('../model/withdraw')
const Receipt=require('../model/receipt')
const Notification=require('../model/notification');

router.get('/notifications', (req, res) => {
    Notification.find({},(err,allNotifications)=>{
        if(err){
            return console.log(err)
        }
         res.json({notifications:allNotifications});
    })
});

router.post('/:user/withdraw',(req,res)=>{
    const userWithdrawal={
        paymentType:req.body.paymentType,
        paymentDate:Date.now(),
        amount:req.body.amount,
        address:req.body.address
    }
    
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user==null){ res.json({err:"user does not exist"});}
        else{
            if(user.withdrawble<userWithdrawal.amount){
                 res.json({insufficient:true,user});
            }
            else{
                user.withdrawble=user.withdrawble-userWithdrawal.amount
                Withdraw.create(userWithdrawal,(err,withdraw)=>{})
                user.save(()=>{
                    res.json({insufficient:false,user});
                }) 
            }
        }
    })
})

router.post('/:user/credit',(req,res)=>{
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user==null){ res.json({err:"user does not exist"});}
        else{
            user.withdrawble=user.withdrawble+10000000000
            user.save(()=>{
                 res.json(user);
            })
        }
    })
})

router.post('/:user/transfer',(req,res)=>{
    const amount=req.body.amount
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user==null){ res.json({err:"user does not exist"});}
        else{
            User.findOne({username:req.body.user},(error,recipient)=>{
                if(error || recipient==null){ res.json({userFalse:true});}
                else{
                    if(user.deposit>=amount || user.withdrawble>=amount ){
                        Receipt.create({text:`${user.name} transferred ${amount} BTX to you.`},(err,recipientReceipt)=>{
                            if(user.deposit>=amount){
                                recipient.deposit=recipient.deposit+amount
                                recipient.receipt.push(recipientReceipt)
                                recipient.save()
                                Receipt.create({text:`you transferred ${amount} BTX to ${recipient.name}.`},(err,userReceipt)=>{
                                    user.deposit=user.deposit-amount
                                    user.receipt.push(userReceipt)
                                    user.save(()=>{
                                        res.json({success:true,user})
                                    })
                                })
                                
                                
                            }else if(user.withdrawble>=amount){
                                recipient.receipt.push(recipientReceipt)
                                recipient.deposit=recipient.deposit+amount
                                recipient.save()
                                Receipt.create({text:`you transferred ${amount} BTX to ${recipient.name}.`},(err,userReceipt)=>{
                                    user.receipt.push(userReceipt)
                                    user.withdrawble=user.withdrawble-amount
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