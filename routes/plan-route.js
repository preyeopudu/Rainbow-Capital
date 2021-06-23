const express =require("express")
const router = express.Router();
const mongoose = require('mongoose');
const Plan=require('../model/plan')
const Receipt=require('../model/receipt')
const User =require('../model/user');
const Referal=require('../model/referal')
///routes to all available stacks in billion traderx///


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('auth/signin')
}

router.post('/:user/plan/:plan',isLoggedIn, (req, res) => {
    planName=req.params.plan
    let bonus
    let plan
    if(planName=="student"){
        plan={name:"STUDENT",cost:18000,daily:1242,matureDate:Date.now()+29*24*60*60*1000}
        bonus=900
    }
    else if(planName=='artisans'){
        plan={name:"ARTISANS",cost:33000,daily:2278,matureDate:Date.now()+29*24*60*60*1000}
        bonus=1650
    }
    else if(planName=="jobholders"){
        plan={name:"JOB HOLDERS",cost:70000,daily:4833,matureDate:Date.now()+29*24*60*60*1000}
        bonus=3500
    }
    else if(planName=="civil"){
        plan={name:"CIVIL",cost:130000,daily:8976,matureDate:Date.now()+29*24*60*60*1000}
        bonus=6500
    }
    else if(planName=="entrepreneur"){

        plan={name:"ENTREPRENEUR",cost:300000,daily:20714,matureDate:Date.now()+29*24*60*60*1000}
        bonus=15000
    }
    else if(planName=="professional"){
        plan={name:"PROFESSIONAL",cost:640000,daily:44190,matureDate:Date.now()+29*24*60*60*1000}
        bonus=320000
    }
    else if(planName=="capitalist"){
        plan={name:"CAPITALIST",cost:1100000,daily:75952,matureDate:Date.now()+29*24*60*60*1000}
        bonus=55000
    }
    
    User.findOne({username:req.params.user},(err,user)=>{
        if(err ||user==null){console.log(err)}
        else{
            if(user.plan.length>0){ res.json({active:true});}
            else if(user.plan.length==0){
                if(user.Amount>=plan.cost||user.deposit>=plan.cost){
                    Plan.create(plan,(err,plan)=>{
                        Receipt.create({text:`- ${plan.cost} NGN`,postBalance:`${user.deposit} NGN`,details:`Purchase`},(err,receipt)=>{
                            if(user.deposit>=plan.cost){
                                user.deposit=Number(user.deposit)-plan.cost
                            }else if(user.Amount>=plan.cost){
                                user.Amount=Number(user.Amount)-plan.cost
                            }
                            if(user.bonus==false){
                                User.findOne({username:user.referee},(err,foundrefree)=>{
                                    if(err||foundrefree==null){
                                        user.plan.push(plan)
                                        user.active=true
                                        user.bonus=true
                                        user.receipt.push(receipt)
                                        user.save(()=>{res.json({user})})
                                    }
                                    else{
                                        if(user.username!=foundrefree.username){
                                            Referal.create({userName:user.username,amount:bonus},(err,referal)=>{
                                                if(err){res.json({err})
                                            }else{
                                                foundrefree.referals.push(referal)
                                                foundrefree.interest=Number(foundrefree.interest)+Number(bonus)
                                                foundrefree.referalEarnings=Number(foundrefree.referalEarnings)+Number(bonus)
                                               
                                                foundrefree.save((err)=>{
                                                    if(err){console.log(err)}
                                                    else{console.log(foundrefree.referals)}
                                                })
        
                                            }
                                            })
                                            user.active=true
                                            user.bonus=true
                                            user.receipt.push(receipt)
                                            user.plan.push(plan)
                                            user.save(()=>{res.json({user})})
                                        }
                                    }
                                })
                            }else{
                                user.bonus=true
                                user.active=true
                                user.receipt.push(receipt)
                                user.plan.push(plan)
                                user.save(()=>{res.json({user})})
                            }
                        })
                 
                      
                    })
                }
                else{
                    res.json({insufficient:true})
                }
            }
        }
    })
});

module.exports = router  