const express =require("express")
const router = express.Router();
const mongoose = require('mongoose');
const Stack=require('../model/stack')
const Receipt=require('../model/receipt')
const User =require('../model/user');
///routes to all available stacks in billion traderx///

router.post('/:user/stack/emerald', (req, res) => {
    console.log(req.params.user)
    const emerald={name:"Emerald Stack",cost:3000,return:5550,matureDate:Date.now()+10*24*60*60*1000}
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user == null){
            res.json({
                err:"user does not exist"
            });
        }
        else{
            if(user.stack.length>0){
                 res.json({active:true});
            }
            else{
                if(user.deposit>=emerald.cost || user.withdrawble>=emerald.cost ){
                    Stack.create(emerald,(err,stack)=>{
                        if(user.deposit>=emerald.cost){
                            user.deposit=user.deposit-emerald.cost
                        }
                        else if(user.withdrawble>=emerald.cost){
                            user.withdrawble=user.withdrawble-emerald.cost
                        }
                        
                        if(user.bonus===false){
                            User.findOne({username:user.referee},(err,foundrefree)=>{
                                if(err || found==null){console.log('error')}
                                else{
                                    if(user.username!=foundrefree.username){
                                        console.log("duped")
                                    found.deposit= found.deposit + 500
                                    found.save()
                                    }
                                    
                                }
                            })

                            user.stack.push(stack)
                            user.bonus=
                            user.save(()=>{
                                res.json({user});
                       })


                        }
                       
                })
                }
                else{
                     res.json({insufficient:true});
                }
                    
            }
            
            
        }
    })
});


router.post('/:user/stack/ruby', (req, res) => {

    const ruby={name:"Ruby Stack",cost:5000,return:9500,matureDate:Date.now()+10*24*60*60*1000}
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user == null){
            res.json({
                err:"user does not exist"
            });
        }
        else{
            if(user.stack.length>0){
                res.json({active:true});
            }
            else{
                if(user.deposit>=ruby.cost || user.withdrawble>=ruby.cost ){
                    
                    Stack.create(ruby,(err,stack)=>{
                        if(user.deposit>=ruby.cost){
                            user.deposit=user.deposit-ruby.cost
                        }
                        else if(user.withdrawble>=ruby.cost){
                            user.withdrawble=user.withdrawble-ruby.cost
                        }
                        user.stack.push(stack)
                        if(user.bonus===false){
                            User.findOne({username:user.referee},(err,foundrefree)=>{
                                if(err || foundrefree==null){console.log('error')}
                                else{
                                    if(user.username!=foundrefree.username){
                                    foundrefree.deposit= foundrefree.deposit + 1000
                                    console.log("duped")
                                    foundrefree.save()
                                    console.log(foundrefree)}
                                    
                                }
                            })
                        }
                        user.bonus=true
                        user.save(()=>{
                             res.json({user});
                    })
                })
                }
                else{
                    res.json({insufficient:true});
               }
            }            
        }
    })
})


router.post('/:user/stack/beryl', (req, res) => {

    const beryl={name:"Beryl Stack",cost:10000,return:20000,matureDate:Date.now()+12*24*60*60*1000}
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user == null){
            res.json({
                err:"user does not exist"
            });
        }
        else{
            if(user.stack.length>0){
                res.json({active:true})
            }
            else{
                

                if(user.deposit>=beryl.cost || user.withdrawble>=beryl.cost ){
                    Stack.create(beryl,(err,stack)=>{
                        if(user.deposit>=beryl.cost){
                            user.deposit=user.deposit-beryl.cost
                        }
                        else if(user.withdrawble>=beryl.cost){
                            user.withdrawble=user.withdrawble-beryl.cost
                        }
                        if(user.bonus===false){
                            User.findOne({username:user.referee},(err,foundrefree)=>{
                                if(err || foundrefree==null){console.log('error')}
                                else{
                                    if(user.username!=foundrefree.username){
                                    foundrefree.deposit= foundrefree.deposit + 1500
                                    console.log('duped')
                                    foundrefree.save()
                                    }
                                    
                                }
                            })
                        }
                        user.stack.push(stack)
                        user.bonus=true
                        user.save(()=>{
                             res.json({user});
                    })
                })
                }

                else{
                    res.json({insufficient:true});
               }


            }
            
            
        }
    })
})


router.post('/:user/stack/onyx', (req, res) => {

    const onyx={name:"Onyx Stack",cost:20000,return:42000,matureDate:Date.now()+26*24*60*60*1000}
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user == null){
            res.json({
                err:"user does not exist"
            });
        }
        else{
            if(user.stack.length>0){
                res.json({active:true});
            }
            else{
                if(user.deposit>=onyx.cost || user.withdrawble>=onyx.cost ){
                    
                    Stack.create(onyx,(err,stack)=>{
                        if(user.deposit>=onyx.cost){
                            user.deposit=user.deposit-onyx.cost
                        }
                        else if(user.withdrawble>=onyx.cost){
                            user.withdrawble=user.withdrawble-onyx.cost
                        }
                        user.stack.push(stack)
                        if(user.bonus===false){
                            User.findOne({username:user.referee},(err,foundrefree)=>{
                                if(err || foundrefree==null){console.log('error')}
                                else{
                                    if(user.username!=foundrefree.username){
                                    foundrefree.deposit= foundrefree.deposit + 2000
                                    foundrefree.save() }
                                }
                            })
                        }
                        user.bonus=true
                        user.save(()=>{
                             res.json({user});
                    })
                })
                }

                else{
                    res.json({insufficient:true});
               }
            }
            
            
        }
    })
})



router.post('/:user/stack/sapphire', (req, res) => {

    const sapphire={name:"Sapphire Stack",cost:50000,return:120000,matureDate:Date.now()+28*24*60*60*1000}
    User.findOne({username:req.params.user},(err,user)=>{
        if(err || user == null){
            res.json({
                err:"user does not exist"
            });
        }
        else{
            if(user.stack.length>0){
                res.json({active:true});
            }
            else{
                if(user.deposit>=sapphire.cost || user.withdrawble>=sapphire.cost ){
                    
                    Stack.create(sapphire,(err,stack)=>{
                        if(user.deposit>=sapphire.cost){
                            user.deposit=user.deposit-sapphire.cost
                        }
                        else if(user.withdrawble>=sapphire.cost){
                            user.withdrawble=user.withdrawble-sapphire.cost
                        }
                        user.stack.push(stack)
                        if(user.bonus===false){
                            User.findOne({username:user.referee},(err,foundrefree)=>{
                                if(err || foundrefree==null||user.username==foundrefree.username){console.log('error')}
                                else{
                                    if(user.username!=foundrefree.username){
                                    foundrefree.deposit= foundrefree.deposit + 3000
                                    foundrefree.save()}
                                }
                            })
                        }

                        user.bonus=true
                        user.save(()=>{
                             res.json({user});
                    })
                })
                }

                else{
                    res.json({insufficient:true});
               }
            }
            
            
        }
    })
})

module.exports = router  