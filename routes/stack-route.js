const express =require("express")
const router = express.Router();
const mongoose = require('mongoose');
const Stack=require('../model/stack')
const Receipt=require('../model/receipt')
const User =require('../model/user');
///routes to all available stacks in billion traderx///




router.post('/:user/stack/ruby', (req, res) => {

    const ruby={name:"Ruby Stack",cost:5000,return:9000,matureDate:Date.now()+12*24*60*60*1000}
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user == null){
            res.json({
                err:"user does not exist"
            });
        }
        else{
            if(Number(user.previous)>ruby.cost){
                 res.json({invalid:true});
            }else{
                if(user.stack.length===1 || user.stack.length>0){
                    res.json({active:true});
                }
                else if(user.stack.length===0){
                    if(user.lockedFund>=ruby.cost||user.deposit>=ruby.cost || user.withdrawble>=ruby.cost ){
                        
                        Stack.create(ruby,(err,stack)=>{
                            if(user.lockedFund>=ruby.cost){
                                user.lockedFund=Number(user.lockedFund)-ruby.cost
                                user.withdrawble=Number(user.lockedFund)+Number(user.withdrawble)
                                user.lockedFund=0
                            }
                            else if(user.deposit>=ruby.cost){
                                user.deposit=Number(user.deposit)-ruby.cost
                            }
                            else if(user.withdrawble>=ruby.cost){
                                user.withdrawble=Number(user.withdrawble)-ruby.cost
                            }
                            if(user.bonus==false){ 
                                User.findOne({username:user.referee},(err,foundrefree)=>{
                                    if(err || foundrefree==null){
                                        console.log('no referall')
                                        user.stack.push(stack)
                                        user.save(()=>{res.json({user})})
                                    }
                                    else{
                                        if(user.username!=foundrefree.username){
                                            foundrefree.referal=parseInt(foundrefree.referal)+1
                                            foundrefree.deposit=Number(foundrefree.deposit)+1000
                                            foundrefree.people.push(user)
                                            foundrefree.referalAmount=foundrefree.referalAmount+1000
                                            
                                            console.log("referall bonus")
                                            foundrefree.save(()=>{
                                                console.log(foundrefree.username)
                                            })
                                            user.bonus= true
                                            user.stack.push(stack)
                                            user.save(()=>{res.json({user})})
                                        }
                                    }
                                })}
    
                                else {
                                    user.stack.push(stack)
                                    user.bonus=true
                                    user.save(()=>{ res.json({user});})
                               }
                    })
                    }
                    else{
                        res.json({insufficient:true});
                   }
                } 
            }
                       
        }
    })
})


router.post('/:user/stack/beryl', (req, res) => {

    const beryl={name:"Beryl Stack",cost:10000,return:18000,matureDate:Date.now()+15*24*60*60*1000}
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user == null){
            res.json({
                err:"user does not exist"
            });
        }
        else{
            if(Number(user.previous)>beryl.cost){
                res.json({invalid:true});
           }else{
            if(user.stack.length===1 || user.stack.length>0){
                res.json({active:true})
            }
            else if(user.stack.length===0){
                
                if(user.lockedFund>=beryl.cost||user.deposit>=beryl.cost || user.withdrawble>=beryl.cost ){
                    Stack.create(beryl,(err,stack)=>{
                        if(user.lockedFund>=beryl.cost){
                            user.lockedFund=Number(user.lockedFund)-beryl.cost
                            user.withdrawble=Number(user.lockedFund)+Number(user.withdrawble)
                            user.lockedFund=0
                        }

                        else if(user.deposit>=beryl.cost){
                            user.deposit=user.deposit-beryl.cost
                        }
                        else if(user.withdrawble>=beryl.cost){
                            user.withdrawble=user.withdrawble-beryl.cost
                        }
                        if(user.bonus==false){ 
                            User.findOne({username:user.referee},(err,foundrefree)=>{
                                if(err || foundrefree==null){
                                    console.log('no referral')
                                    user.stack.push(stack)
                                    user.save(()=>{res.json({user})})
                                }
                                else{
                                    if(user.username!=foundrefree.username){
                                        foundrefree.referal=parseInt(foundrefree.referal)+1
                                        foundrefree.people.push(user)
                                        foundrefree.referalAmount=foundrefree.referalAmount+1500
                                        
                                        foundrefree.deposit=Number(foundrefree.deposit)+1500
                                        console.log("referall bonus")
                                        foundrefree.save(()=>{
                                            console.log(foundrefree.username)
                                        })
                                        user.bonus= true
                                        user.stack.push(stack)
                                        user.save(()=>{res.json({user})})
                                    }
                                }
                            })}

                            else {
                                user.stack.push(stack)
                                user.bonus=true
                                user.save(()=>{ res.json({user});})
                           }
                })
                }

                else{
                    res.json({insufficient:true});
               }


            }
            
           }
            
            
        }
    })
})


router.post('/:user/stack/onyx', (req, res) => {

    const onyx={name:"Onyx Stack",cost:20000,return:39000,matureDate:Date.now()+30*24*60*60*1000}
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user == null){
            res.json({
                err:"user does not exist"
            });
        }
        else{
            if(Number(user.previous)>onyx.cost){
                res.json({invalid:true});
           }else{
            if(user.stack.length===1 || user.stack.length>0){
                res.json({active:true});
            }
            else if(user.stack.length===0){
                if(user.lockedFund>=onyx.cost||user.deposit>=onyx.cost || user.withdrawble>=onyx.cost ){
                    
                    Stack.create(onyx,(err,stack)=>{
                        if(user.lockedFund>=onyx.cost){
                            user.lockedFund=Number(user.lockedFund)-onyx.cost
                            user.withdrawble=Number(user.lockedFund)+Number(user.withdrawble)
                            user.lockedFund=0
                        }
                        else if(user.deposit>=onyx.cost){
                            user.deposit=Number(user.deposit)-Number(onyx.cost)
                        }
                        else if(user.withdrawble>=onyx.cost){
                            user.withdrawble=user.withdrawble-onyx.cost
                        }
                        user.stack.push(stack)
                        if(user.bonus==false){ 
                            User.findOne({username:user.referee},(err,foundrefree)=>{
                                if(err || foundrefree==null){
                                    console.log('no referral')
                                    user.stack.push(stack)
                                    user.save(()=>{res.json({user})})
                                }
                                else{
                                    if(user.username!=foundrefree.username){
                                        foundrefree.referal=parseInt(foundrefree.referal)+1
                                        foundrefree.people.push(user)
                                        foundrefree.referalAmount=foundrefree.referalAmount+2000
                                       
                                        foundrefree.deposit=Number(foundrefree.deposit)+2000
                                        console.log("referall bonus")
                                        foundrefree.save((err)=>{
                                            if(err){console.log(err)}
                                            else{
                                                console.log(foundrefree.username)
                                            }
                                            
                                        })
                                        user.bonus= true
                                        user.stack.push(stack)
                                        user.save(()=>{res.json({user})})
                                    }
                                }
                            })}

                            else {
                                user.stack.push(stack)
                                user.bonus=true
                                user.save(()=>{ res.json({user});})
                           }
                })
                }

                else{
                    res.json({insufficient:true});
               }
            }
        }
            
        }
    })
})



router.post('/:user/stack/sapphire', (req, res) => {

    const sapphire={name:"Sapphire Stack",cost:50000,return:97000,matureDate:Date.now()+30*24*60*60*1000}
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user == null){
            res.json({
                err:"user does not exist"
            });
        }
        else{
            if(Number(user.previous)>sapphire.cost){
                res.json({invalid:true});
           }else{
            if(user.stack.length===1 || user.stack.length>0){
                res.json({active:true});
            }
            else if(user.stack.length===0){
                if(user.lockedFund>=sapphire.cost||user.deposit>=sapphire.cost || user.withdrawble>=sapphire.cost ){
                    
                    Stack.create(sapphire,(err,stack)=>{
                        if(user.lockedFund>=sapphire.cost){
                            user.lockedFund=Number(user.lockedFund)-sapphire.cost
                            user.withdrawble=Number(user.lockedFund)+Number(user.withdrawble)
                            user.lockedFund=0
                        }
                        else if(user.deposit>=sapphire.cost){
                            user.deposit=user.deposit-sapphire.cost
                        }
                        else if(user.withdrawble>=sapphire.cost){
                            user.withdrawble=user.withdrawble-sapphire.cost
                        }
                        if(user.bonus==false){ 
                            User.findOne({username:user.referee},(err,foundrefree)=>{
                                if(err || foundrefree==null){
                                    console.log('no referalls')
                                    user.stack.push(stack)
                                    user.save(()=>{res.json({user})})
                                }
                                else{
                                    if(user.username!=foundrefree.username){
                                        foundrefree.referal=parseInt(foundrefree.referal)+1
                                        foundrefree.people.push(user)
                                        foundrefree.referalAmount=foundrefree.referalAmount+3000
                                       
                                        foundrefree.deposit=Number(foundrefree.deposit)+3000
                                        console.log("referall bonus")
                                        foundrefree.save(()=>{
                                            console.log(foundrefree.username)
                                        })
                                        user.bonus= true
                                        user.stack.push(stack)
                                        user.save(()=>{res.json({user})})
                                    }
                                }
                            })}

                            else {
                                user.stack.push(stack)
                                user.bonus=true
                                user.save(()=>{ res.json({user});})
                           }
                })
                }

                else{
                    res.json({insufficient:true});
               }
            }
        }
            
        }
    })
})


router.post('/:user/stack/topaz', (req, res) => {
    console.log(req.params.user)
    const topaz={name:"Topaz Stack",cost:75000,return:146250,matureDate:Date.now()+30*24*60*60*1000}
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user == null){
            res.json({
                err:"user does not exist"
            });
        }
        else{
            if(Number(user.previous)>topaz.cost){
                res.json({invalid:true});
           }else{
            if(user.stack.length===1 || user.stack.length>0){
                 res.json({active:true});
            }
            else if(user.stack.length===0){
                if(user.lockedFund>=topaz.cost||user.deposit>=topaz.cost || user.withdrawble>=topaz.cost ){
                    Stack.create(topaz,(err,stack)=>{
                        if(user.lockedFund>=topaz.cost){
                            user.lockedFund=Number(user.lockedFund)-topaz.cost
                            user.withdrawble=Number(user.lockedFund)+Number(user.withdrawble)
                            user.lockedFund=0
                        }
                        else if(user.deposit>=topaz.cost){
                            user.deposit=Number(user.deposit)-topaz.cost
                        }
                        else if(user.withdrawble>=topaz.cost){
                            user.withdrawble=Number(user.withdrawble)-topaz.cost
                        }
                        
                        if(user.bonus==false){ 
                            User.findOne({username:user.referee},(err,foundrefree)=>{
                                if(err || foundrefree==null){
                                    console.log('no referral')
                                    user.stack.push(stack)
                                    user.save(()=>{res.json({user})})
                                }
                                else{
                                    if(user.username!=foundrefree.username){
                                        foundrefree.referal=parseInt(foundrefree.referal)+1
                                        foundrefree.people.push(user)
                                        foundrefree.referalAmount=foundrefree.referalAmount+5000
                                       
                                        foundrefree.deposit=Number(foundrefree.deposit)+5000
                                        
                                        foundrefree.save(()=>{
                                            console.log(foundrefree.username)
                                        })
                                        user.bonus= true
                                        user.stack.push(stack)
                                        user.save(()=>{res.json({user})})
                                    }
                                }
                            })}

                       else {
                            user.stack.push(stack)
                            user.bonus=true
                            user.save(()=>{ res.json({user});})
                       }
                       
                })
                }
                else{
                     res.json({insufficient:true});
                }
                    
            }
        }
            
        }
    })
});

module.exports = router  