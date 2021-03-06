const express = require("express");
const router = express.Router();
const imgModel=require('../model/images')
const mongoose = require("mongoose");
const User = require("../model/user");
const Withdraw = require("../model/withdraw");
const Receipt = require("../model/receipt");
const Notification = require("../model/notification");
const Fiat = require("../model/fiat");
const Ad = require("../model/ad");
const Point = require("../model/points");
const Coupon = require("../model/coupon");
const Crypto = require("../model/crypto");
const { Router } = require("express");
const Plan = require("../model/plan");
const Saving = require("../model/saving");

// User.findOne({},(err,user)=>{
//     if(err)(console.log(err))
//     else{
//         console.log(user)
//     }
// })

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("auth/signin");
}



router.get("/transactions", isLoggedIn, (req, res) => {
  res.render("transactions", { user: req.user });
});

router.get("/profile",isLoggedIn,(req,res)=>{
 
      res.render("profile",{user:req.user})
    
 
})


router.get("/withdraw", isLoggedIn, (req, res) => {
  res.render("withdraw", { user: req.user });
});

router.get("/withdraw/bitcoin", isLoggedIn, (req, res) => {
  res.render("bitcoin", { user: req.user });
});

router.get("/withdraw/ethereum", isLoggedIn, (req, res) => {
  res.render("ethereum", { user: req.user });
});

router.post("/:user/ethereum", (req, res) => {
  const userCrypto = {
    amount: req.body.amount,
    wallet: req.body.wallet,
    facebook: req.body.facebook,
    user: req.user.username,
    type: "ethereum",
  };

  User.findOne({ username: req.params.user }, (err, user) => {
    if (err || user == null) {
      res.json({ err: "user does not exist" });
    } else {
      if (user.interest < userCrypto.amount) {
        res.redirect("/plan");
      }
      User.findOne({ username: req.params.user }, (err, user) => {
        if (err || user == null) {
          res.redirect("/plan");
        } else {
          if (user.plan.length > 0) {
            res.redirect("/dashboard");
          } else {
            if (user.interest < userCrypto.amount) {
              res.redirect("/plan");
            } else {
              Receipt.create(
                {
                  text: `-${userCrypto.amount} NG`,
                  postBalance: `${user.interest} NGN`,
                  details: `Withdrawal`,
                },
                (err, receipt) => {
                  if (err) {
                    console.log(err);
                  } else {
                    user.interest =
                      Number(user.interest) - Number(userCrypto.amount);
                    user.receipt.push(receipt);
                    user.ip = req.headers["x-forwarded-for"];
                    Crypto.create(userCrypto, (err, withdraw) => {});
                    user.save((err) => {
                      if (err) {
                        console.log(err);
                        res.redirect("/plan");
                      } else {
                        console.log(userCrypto);
                        res.redirect("/plan");
                      }
                    });
                  }
                }
              );
            }
          }
        }
      });
    }
  });
});

router.post("/:user/bitcoin", (req, res) => {
  const userCrypto = {
    amount: req.body.amount,
    wallet: req.body.wallet,
    facebook: req.body.facebook,
    user: req.user.username,
    type: "bitcoin",
  };

  User.findOne({ username: req.params.user }, (err, user) => {
    if (err || user == null) {
      res.json({ err: "user does not exist" });
    } else {
      if (user.plan.length > 0) {
        res.redirect("/dashboard");
      } else {
        if (user.interest < userCrypto.amount) {
          res.redirect("/dashboard");
        }
        User.findOne({ username: req.params.user }, (err, user) => {
          if (err || user == null) {
            res.json({ err: "user does not exist" });
          } else {
            if (user.interest < userCrypto.amount) {
              res.redirect("/plan");
            } else {
              Receipt.create(
                {
                  text: `-${userCrypto.amount} NG`,
                  postBalance: `${user.interest} NGN`,
                  details: `Withdrawal`,
                },
                (err, receipt) => {
                  if (err) {
                    console.log(err);
                  } else {
                    user.interest =
                      Number(user.interest) - Number(userCrypto.amount);
                    user.receipt.push(receipt);
                    user.ip = req.headers["x-forwarded-for"];
                    Crypto.create(userCrypto, (err, withdraw) => {});
                    user.save((err) => {
                      if (err) {
                        console.log(err);
                        res.redirect("/plan");
                      } else {
                        console.log(userCrypto);
                        res.redirect("/transactions");
                      }
                    });
                  }
                }
              );
            }
          }
        });
      }
    }
  });
});



router.post("/:user/fiat", isLoggedIn, (req, res) => {
  
  const userFiat = {
    accountName: req.body.accountName,
    amount: req.body.amount,
    accountNumber: req.body.accountNumber,
    bank: req.body.bank,
    user: req.params.user,
    facebook: req.body.facebook,
  };

  User.findOne({username:userFiat.user},(err,user)=>{
    if(err || user==null ){res.send('An error Occured')}
    else{
      if(user.interest<userFiat.amount){
        res.redirect('/deposit')
      }else{
        if(user.interest>=userFiat.amount){
          Receipt.create({text:`-${userFiat.amount} NGN`,postBalance:`${user.interest} NGN`,details:'Withdrawal'},(err,receipt)=>{
            if(err){res.send('An error occured generating receipt')}
            else{
              Fiat.create(userFiat,(err,fiat)=>{
                if(err){res.send('An error occured in sending your withdrawal request')}
                else{
                  user.receipt.push(receipt)
                  user.interest=Number(user.interest)-Number(userFiat.amount)
                  user.save((err)=>{
                    if(err){res.send('An error occured while updating user')}
                    else{
                      res.redirect("/transactions");
                    }
                  })
                }
              })
            }
          })
        }
      }
    }
  })

})



router.post("/:user/deposit", isLoggedIn, (req, res) => {
  let couponcode = req.body.coupon;
  Coupon.findOneAndDelete({ code: couponcode }, (err, coupon) => {
    if (err || coupon == null) {
      res.json({ err });
    } else {
      User.findOne({ username: req.params.user }, (err, user) => {
        if (err || user == null) {
          res.json({ err });
        } else {
          Receipt.create(
            {
              text: `+ ${coupon.value} NGN`,
              postBalance: `${user.deposit} NGN`,
              details: `Deposit`,
            },
            (err, receipt) => {
              if (err) {
                console.log(err);
              } else {
                console.log(receipt);
                user.receipt.push(receipt);
                user.deposit = Number(user.deposit) + Number(coupon.value);
                user.save((err) => {
                  if (err) {
                    res.json({ err });
                  } else {
                    res.redirect("/dashboard");
                  }
                });
              }
            }
          );
        }
      });
    }
  });
});

router.post("/:user/save", isLoggedIn, (req, res) => {
  let amount = req.body.amount;
  let time = req.body.time;
  let date;
  console.log(amount);
  if (time == "2 Months") {
    date = 60;
  } else if (time == "4 Months") {
    date = 120;
  } else if (time == "6 Months") {
    date = 180;
  } else if (time == "8 Months") {
    date = 240;
  } else if (time == "10 Months") {
    date = 300;
  } else if (time == "12 Months") {
    date = 360;
  }

  console.log(date);
  User.findOne({ username: req.params.user }, (err, user) => {
    if (err || user == null) {
      console.log(err);
    } else {
      if (user.savings.length > 0) {
        res.redirect("/dashboard");
      } else {
        if (user.interest >= Number(amount)) {
          Saving.create(
            {
              matureDate: Date.now() + date * 24 * 60 * 60 * 1000,
              cost: amount,
            },
            (err, savings) => {
              Receipt.create(
                {
                  text: `- ${amount} NGN`,
                  postBalance: `${user.interest} NGN`,
                  details: `Save`,
                },
                (err, receipt) => {
                  console.log(receipt);
                  user.interest = Number(user.interest) - amount;
                  user.receipt.push(receipt);
                  user.savings.push(savings);
                  user.save((err) => {
                    if (err) {
                      console.log(`err ${err}`);
                      res.redirect("/saving");
                    } else {
                      res.redirect("/saving");
                    }
                  });
                }
              );
            }
          );
        } else {
          res.redirect("/deposit");
        }
      }
    }
  });
});

router.post("/:user/ad", isLoggedIn, (req, res) => {
  console.log(1);
  User.findOne({ username: req.params.user }, (err, user) => {
    if (err) {
      console.log("an error occured user-routes 144");
    } else {
      if (user.shared === false) {
        user.interest = Number(user.interest) + user.plan[0].daily;
        console.log(user.plan[0].daily);
        user.shared = true;

        if (Date.now() >= user.plan[0].matureDate) {
          Plan.findByIdAndDelete(user.plan[0]._id, (err) => {
            if (err) {
              res.json({ err });
            } else {
              user.isOnPlan=false
              user.plan=[]
              user.save(() => {
                if (err) {
                  console.log(err);
                } else {
                  res.redirect("/dashboard");
                }
              });
            }
          });
        } else {
          user.isOnPlan=true
          user.save((err) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/dashboard");
            }
          });
        }
      } else {
        res.redirect("/dashboard");
      }
    }
  });
});

module.exports = router;
