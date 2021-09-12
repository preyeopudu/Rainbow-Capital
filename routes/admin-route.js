const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../model/user");
const Withdraw = require("../model/withdraw");
const Notification = require("../model/notification");
const Fiat = require("../model/fiat");
const Point = require("../model/points");
const Ad = require("../model/ad");
const Bill = require("../model/bill");
const Coupon = require("../model/coupon");
const Crypto = require("../model/crypto");

User.register(
  new User({ username: "RainbowMen" }),
  "@RainbowCapitals2021",
  (err, user) => {
    if (err) {
      console.log(err);
    }
  }
);

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.username == "RainbowMen") {
    return next();
  }
  res.redirect("/admin/login");
}

router.get("/admin/login", (req, res) => {
  res.render("./admin/login");
});

router.get("/admin/logout", (req, res) => {
  req.logOut();
  req.flash("success", "successfully logged out");
  res.redirect("/admin/login");
});

router.post(
  "/admin/login",
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back");
    res.redirect("/transfer");
  }
);

router.get("/admin/notifications", isAdmin, (req, res) => {
  res.render("./admin/notification");
});

router.post("/admin/notifications", isAdmin, (req, res) => {
  User.updateMany({ notice: false }, { notice: true }, (err, writeResult) => {
    console.log(writeResult);
  });
  Notification.create(
    { title: req.body.title, text: req.body.text },
    (err, notification) => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success", "Notification has been sent");
        res.redirect("/admin/notifications");
      }
    }
  );
});

router.get("/admin/ads", (req, res) => {
  res.render("./admin/ad");
});

router.post("/admin/ads", isAdmin, (req, res) => {
  User.updateMany({ shared: true }, { shared: false }, (err, writeResult) => {
    console.log(writeResult);
  });
  Ad.findOneAndDelete({}, (err) => {
    if (err) {
      console.log(err);
    } else {
      Ad.create(
        { title: req.body.title, content: req.body.text },
        (err, ad) => {
          if (err) {
            console.log(err);
          } else {
            req.flash("success", "Ad post has been sent");
            res.redirect("/admin/ads");
          }
        }
      );
    }
  });
});

router.get("/transfer", isAdmin, (req, res) => {
  res.render("./admin/transfer");
});

router.get("/coupon", isAdmin, (req, res) => {
  res.render("./admin/coupon");
});

router.get("/reset", isAdmin, (req, res) => {
  res.render("reset");
});

router.post("/generate", isAdmin, (req, res) => {
  let couponCode = Math.floor(Math.random() * 900000 + 100000);

  Coupon.create({ value: req.body.value, code: couponCode }, (err, coupon) => {
    if (err || req.body.value == null) {
      console.log(err);
      req.flash("error", "failed to generate coupon");
      res.redirect("/transfer");
    } else {
      console.log(coupon);
      res.render("./admin/coupon", { code: coupon });
    }
  });
});

router.get("/Bitcoin", isAdmin, (req, res) => {
  Crypto.find({ type: "bitcoin" }, (err, withdrawals) => {
    if (err) {
      console.log(err);
    } else {
      res.render("./admin/withdrawal", {
        withdrawals: withdrawals,
        type: "Bitcoin",
      });
    }
  });
});

router.get("/Ethereum", isAdmin, (req, res) => {
  Crypto.find({ type: "ethereum" }, (err, withdrawals) => {
    if (err) {
      console.log(err);
    } else {
      res.render("./admin/withdrawal", {
        withdrawals: withdrawals,
        type: "Ethereum",
      });
    }
  });
});

router.get("/fiat", isAdmin, (req, res) => {
  Fiat.find({}, (err, fiats) => {
    if (err) {
      console.log(err);
    } else {
      res.render("./admin/fiat", { fiats: fiats });
    }
  });
});

router.get("/point", isAdmin, (req, res) => {
  Point.find({}, (err, points) => {
    if (err) {
      console.log(err);
    } else {
      res.render("point", { points: points });
    }
  });
});

router.post("/transfer/fiat/:id", (req, res) => {
  Fiat.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.redirect("/fiat");
    }
  });
});

router.post("/transfer/:coin/:id", isAdmin, (req, res) => {
  Crypto.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect(`/${req.params.coin}`);
    }
  });
});

module.exports = router;
