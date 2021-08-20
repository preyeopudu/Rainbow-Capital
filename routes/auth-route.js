const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../model/user");
const Otp = require("../model/otp");
const nodemailer = require("nodemailer");
const { route } = require("./user-route");

router.post("/auth/otp", (req, res) => {
  let otpcode = Math.floor(Math.random() * 900000 + 100000);
  let email = req.body.username;
  console.log(`your email is ${email}`);

  User.findOne({ username: email }, (err, user) => {
    if (user != null || err) {
      res.redirect("/auth/signup");
      req.flash("error", "user exists or an error occured");
      console.log("User exists , try again with another email");
    } else {
      Otp.create({ code: otpcode }, async (err, otp) => {
        if (err) {
          console.log(err);
        } else {
          let transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
              user: "splashdev20@gmail.com",
              pass: "programmer8",
            },
          });

          let mailOptions = {
            from: "RainbowCapitals",
            to: `${email}`,
            subject: "RainbowsCapital OTP",
            text: `your signup code : ${otpcode}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              res.send("failed to send OTP");
              res.redirect("/auth/otp");
              console.log({ sent: false });
            } else {
              console.log("Email sent :" + info.response);
              res.redirect("/auth/otp");
              console.log({ sent: true });
            }
          });

          //  res.json({otp});
          console.log(otpcode);
        }
      });
    }
  });
});

router.post("/auth/check", (req, res) => {
  otpcode = req.body.code;
  console.log(otpcode);
  console.log(req.body);
  Otp.findOneAndDelete({ code: otpcode }, (err, otp) => {
    if (err || otp == null) {
      res.redirect("/auth/otp");
    } else {
      res.redirect("/auth/submit");
    }
  });
});

router.get("/auth/submit", (req, res) => {
  res.render("submit");
});

router.post("/auth/signup", (req, res) => {
  const newUser = {
    username: req.body.username,
    name: req.body.name,
    referee: req.body.referee,
    secretCode: req.body.secret,
  };
  console.log(newUser);
  User.register(new User(newUser), req.body.password, (err, user) => {
    if (err) {
      console.error(err);
      return res.send(err.message);
    }
    passport.authenticate("local")(req, res, () => {
      res.send(true);
      console.log(1);
    });
  });
});

router.get("/auth/otp", (req, res) => {
  res.render("otp");
});

router.get("/auth/signup", (req, res) => {
  res.render("registration");
});

router.get("/auth/signin", (req, res) => {
  res.render("login");
});

router.get("/auth/forgot", (req, res) => {
  res.render("forgot");
});

router.post(
  "/auth/signin",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/signin",
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post("/auth/reset", async (req, res) => {
  User.findOne({ username: req.body.username }, (err, founduser) => {
    if (err || founduser === null) {
      res.redirect("/auth/forgot");
      console.log(1);
    } else {
      if (req.body.secret == founduser.secretCode) {
        founduser.setPassword(req.body.password, (err) => {
          if (err) {
            console.log(err);
            res.redirect("/auth/forgot");
            console.log(2);
          } else {
            founduser.save();
            res.redirect("/auth/signin");
          }
        });
      } else {
        res.redirect("/auth/forgot");
        console.log(req.body.secret);
        console.log(founduser.secretCode);
        console.log(3);
      }
    }
  });
});

module.exports = router;
