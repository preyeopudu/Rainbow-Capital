const express = require("express");
const router = express.Router();
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

router.get("/user/:user", (req, res) => {
  User.findOne({ username: req.params.user }, (err, user) => {
    if (err) {
      res.json({ err });
    } else {
      res.json({ user });
    }
  });
});

router.get("/notifications", isLoggedIn, (req, res) => {
  Notification.find({}, (err, allNotifications) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ notifications: allNotifications });
    }
  });
});

router.get("/ads", (req, res) => {
  Ad.find({}, (err, ad) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ ad: ad });
    }
  });
});

router.get("/transactions", isLoggedIn, (req, res) => {
  res.render("transactions", { user: req.user });
});

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
        res.json({ insufficient: true, user });
      }
      User.findOne({ username: req.params.user }, (err, user) => {
        if (err || user == null) {
          res.json({ err: "user does not exist" });
        } else {
          if (user.interest < userCrypto.amount) {
            res.json({ insufficient: true, user });
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
                      res.json({ insufficient: true, user });
                    } else {
                      console.log(userCrypto);
                      res.json({ insufficient: false, user });
                    }
                  });
                }
              }
            );
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
      if (user.interest < userCrypto.amount) {
        res.json({ insufficient: true, user });
      }
      User.findOne({ username: req.params.user }, (err, user) => {
        if (err || user == null) {
          res.json({ err: "user does not exist" });
        } else {
          if (user.interest < userCrypto.amount) {
            res.json({ insufficient: true, user });
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
                      res.json({ insufficient: true, user });
                    } else {
                      console.log(userCrypto);
                      res.json({ insufficient: false, user });
                    }
                  });
                }
              }
            );
          }
        }
      });
    }
  });
});

router.post("/:user/withdraw", isLoggedIn, (req, res) => {
  const userWithdrawal = {
    paymentDate: Date.now(),
    amount: req.body.amount,
    address: req.body.address,
    user: req.params.user,
  };
  console.log(userWithdrawal);
  User.findOne({ username: req.params.user }, (err, user) => {
    if (err || user == null) {
      res.json({ err: "user does not exist" });
    } else {
      if (user.withdrawble < userWithdrawal.amount) {
        res.json({ insufficient: true, user });
      } else if (user.withdrawble >= userWithdrawal.amount) {
        user.withdrawble =
          Number(user.withdrawble) - Number(userWithdrawal.amount);
        user.ip = req.headers["x-forwarded-for"];
        Withdraw.create(userWithdrawal, (err, withdraw) => {
          if (err) {
            console.log(err);
          } else {
            console.log(withdraw);
          }
        });
        user.save((err) => {
          if (err) {
            res.json({ insufficient: true, user });
          } else {
            res.json({ insufficient: false, user });
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
  console.log(userFiat);
  User.findOne({ username: req.params.user }, (err, user) => {
    if (err || user == null) {
      res.json({ err: "user does not exist" });
    } else {
      if (user.interest < userFiat.amount) {
        res.json({ insufficient: true, user });
      } else {
        Receipt.create(
          {
            text: `-${userFiat.amount} NG`,
            postBalance: `${user.interest} NGN`,
            details: `Withdrawal`,
          },
          (err, receipt) => {
            if (err) {
              console.log(err);
            } else {
              user.interest = Number(user.interest) - Number(userFiat.amount);
              user.receipt.push(receipt);
              user.ip = req.headers["x-forwarded-for"];
              Fiat.create(userFiat, (err, withdraw) => {});
              user.save((err) => {
                if (err) {
                  console.log(err);
                  res.json({ insufficient: true, user });
                } else {
                  console.log(userFiat);
                  res.json({ insufficient: false, user });
                }
              });
            }
          }
        );
      }
    }
  });
});

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
  let date = req.body.date;

  User.findOne({ username: req.params.user }, (err, user) => {
    if (err || user == null) {
      console.log(err);
    } else {
      if (user.savings.length > 0) {
        res.redirect("/saving");
      } else {
        Saving.create({}, (err, plan) => {
          Receipt.create(
            {
              text: `- ${plan.cost} NGN`,
              postBalance: `${user.deposit} NGN`,
              details: `Save`,
            },
            (err, receipt) => {
              console.log(receipt)
              if (user.Amount >= amount) {

                user.Amount = Number(user.Amount) - amount;
                user.receipt.push(receipt);
                user.save(() => {
                  res.redirect("/saving");
                });
              } else {
                res.redirect("/saving");
              }
            }
          );
        });
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
              user.plan.pop();
              user.save(() => {
                if (err) {
                  console.log(err);
                } else {
                  res.json({ detail: "yes" });
                }
              });
            }
          });
        } else {
          user.save((err) => {
            if (err) {
              console.log(err);
            } else {
              res.json({ detail: "no" });
            }
          });
        }
      } else {
        res.json({ user });
      }
    }
  });
});

module.exports = router;
