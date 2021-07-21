const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var momentBusinessDays = require("moment-business-days");
const Plan = require("../model/plan");
const Receipt = require("../model/receipt");
const User = require("../model/user");
const Referal = require("../model/referal");
///routes to all available stacks in billion traderx///

const now = momentBusinessDays(new Date(), "DD-MM-YYYY").businessAdd(21)._d;
console.log(now);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("auth/signin");
}

router.post("/:user/plan/:plan", isLoggedIn, (req, res) => {
  planName = req.params.plan;
  let bonus;
  let plan;
  if (planName == "student") {
    plan = {
      name: "STUDENT",
      cost: 18000,
      daily: 1242,
      matureDate: momentBusinessDays(new Date(), "DD-MM-YYYY").businessAdd(21)
        ._d,
    };
    bonus = 900;
  } else if (planName == "artisans") {
    plan = {
      name: "ARTISANS",
      cost: 33000,
      daily: 2278,
      matureDate: momentBusinessDays(new Date(), "DD-MM-YYYY").businessAdd(21)
        ._d,
    };
    bonus = 1650;
  } else if (planName == "jobholders") {
    plan = {
      name: "JOB HOLDERS",
      cost: 70000,
      daily: 4833,
      matureDate: momentBusinessDays(new Date(), "DD-MM-YYYY").businessAdd(21)
        ._d,
    };
    bonus = 3500;
  } else if (planName == "civil") {
    plan = {
      name: "CIVIL",
      cost: 130000,
      daily: 8976,
      matureDate: momentBusinessDays(new Date(), "DD-MM-YYYY").businessAdd(21)
        ._d,
    };
    bonus = 6500;
  } else if (planName == "entrepreneur") {
    plan = {
      name: "ENTREPRENEUR",
      cost: 300000,
      daily: 20714,
      matureDate: momentBusinessDays(new Date(), "DD-MM-YYYY").businessAdd(21)
        ._d,
    };
    bonus = 15000;
  } else if (planName == "professional") {
    plan = {
      name: "PROFESSIONAL",
      cost: 640000,
      daily: 44190,
      matureDate: momentBusinessDays(new Date(), "DD-MM-YYYY").businessAdd(21)
        ._d,
    };
    bonus = 320000;
  } else if (planName == "capitalist") {
    plan = {
      name: "CAPITALIST",
      cost: 1100000,
      daily: 75952,
      matureDate: momentBusinessDays(new Date(), "DD-MM-YYYY").businessAdd(21)
        ._d,
    };
    bonus = 55000;
  }

  User.findOne({ username: req.params.user }, (err, user) => {
    if (err || user == null) {
      console.log(err);
    } else {
      if (user.plan.length > 0) {
        res.redirect("/dashboard");
      } else if (user.plan.length == 0) {
        if (user.interest >= plan.cost || user.deposit >= plan.cost) {
          Plan.create(plan, (err, plan) => {
            Receipt.create(
              {
                text: `- ${plan.cost} NGN`,
                postBalance: `${user.deposit} NGN`,
                details: `Purchase`,
              },
              (err, receipt) => {
                if (user.deposit >= plan.cost) {
                  user.deposit = Number(user.deposit) - plan.cost;
                } else if (user.interest >= plan.cost) {
                  user.interest = Number(user.interest) - plan.cost;
                }
                if (user.bonus == false) {
                  User.findOne(
                    { username: user.referee },
                    (err, foundrefree) => {
                      if (err || foundrefree == null) {
                        user.plan.push(plan);
                        user.active = true;
                        user.bonus = true;
                        user.receipt.push(receipt);
                        user.save(() => {
                          res.redirect("/transactions");
                        });
                      } else {
                        if (user.username != foundrefree.username) {
                          Referal.create(
                            { userName: user.username, amount: bonus },
                            (err, referal) => {
                              if (err) {
                                res.redirect("/transactions");
                              } else {
                                foundrefree.referals.push(referal);
                                foundrefree.interest =
                                  Number(foundrefree.interest) + Number(bonus);
                                foundrefree.referalEarnings =
                                  Number(foundrefree.referalEarnings) +
                                  Number(bonus);

                                foundrefree.save((err) => {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    console.log(foundrefree.referals);
                                  }
                                });
                              }
                            }
                          );
                          user.active = true;
                          user.bonus = true;
                          user.receipt.push(receipt);
                          user.plan.push(plan);
                          user.save(() => {
                            res.redirect("/transactions");
                          });
                        }
                      }
                    }
                  );
                } else {
                  user.bonus = true;
                  user.active = true;
                  user.receipt.push(receipt);
                  user.plan.push(plan);
                  user.save(() => {
                    res.redirect("/transactions");
                  });
                }
              }
            );
          });
        } else {
          res.redirect("/deposit");
        }
      }
    }
  });
});

module.exports = router;
