const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../model/user");
const Otp = require("../model/otp");
const { route } = require("./user-route");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


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
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                clientId: '669866620315-sh1pqk2r43d8ia20unni5ebootc2ut2e.apps.googleusercontent.com',
                clientSecret: 'I1bNTAXVunzBZ-CkrhtXzsmv'
            }
        });
        
        transporter.sendMail({
            from: 'splashdev20@gmail.com',
            to: `${email}`,
            subject: 'Welcome to Rainbow Capitals',
            text: `your OTP : ${otp.code}`,
            auth: {
                user: 'splashdev20@gmail.com',
                refreshToken: '1//04gTLYzmaUfiaCgYIARAAGAQSNwF-L9IrQDRkWFktmGZhXphHeWogsxG0FKz8WG5b0lDTCEFOzJrzxBZrRWLX7MPuuNxC18znRqs',
                accessToken: 'ya29.a0ARrdaM9jgwl0hEeglYBzcoibx8kJRwPgp-LYfYKWrTwWzlLqjNxhjiSwRk3LMzjRB0x6LjuA-r4yrJmmQ3-fpfY3mbKQ5NWhR8Jjg1Pmbxk4jlV-CaTZC2tRyDNbzfW1Y-3OHpH7QCQrmM-Pot_wrBMGDEq3',
             
            }
        });
      

        res.redirect("/auth/otp")
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
