const express = require("express");
var cors = require("cors");
const app = express();

const mongoose = require("mongoose");
app.use(cors());

// const uri = "mongodb://localhost:27017/rainbow";
const uri =
  "mongodb+srv://opudupreye:programmer8@cluster0.bz1ry.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected…");
  })
  .catch((err) => console.log(err));

const stackRoutes = require("./routes/plan-route");
const authRoutes = require("./routes/auth-route");
const adminRoutes = require("./routes/admin-route");
const userRoutes = require("./routes/user-route");
const Stack = require("./model/plan");
const Receipt = require("./model/receipt");
const User = require("./model/user");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const Withdraw = require("./model/withdraw");
const Plan = require("./model/plan");
const Ad = require("./model/ad");
const Notification = require("./model/notification");
const notification = require("./model/notification");
const { use } = require("./routes/user-route");

app.set("view engine", "ejs");
app.use(flash());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "Billion Traderx",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(userRoutes, cors());
app.use(authRoutes, cors());
app.use(stackRoutes, cors());
app.use(adminRoutes, cors());

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.username == "admin") {
    return next();
  }
  res.redirect("/auth/signin");
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("auth/signin");
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/dashboard", isLoggedIn, (req, res) => {
  Ad.find({}, (err, ad) => {
    if (err) {
      console.log(err);
    } else {
      res.render("dashboard", {
        user: req.user,
        referals: req.user.referals,
        ad: ad,
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/blog", (req, res) => {
  Notification.find({}, (err, notification) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("blog", { blogs: notification });
    }
  });
});

app.get("/blog/:id", (req, res) => {
  Notification.findById(req.params.id, (err, notification) => {
    if (err) {
      res.redirect("/");
    } else {
      res.render("blog-details", { blog: notification });
    }
  });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/disclaimer", (req, res) => {
  res.render("disclaimer");
});

app.get("/plan", isLoggedIn, (req, res) => {
  res.render("plan", { user: req.user });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/payment", isLoggedIn, (req, res) => {
  res.render("payment");
});

app.get("/deposit", isLoggedIn, (req, res) => {
  res.render("deposit", { user: req.user });
});

app.get("/saving", isLoggedIn, (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/saving");
    } else {
      if (new Date() >= user.savings[0].matureDate) {
        if (err) {
          console.log(err);
        } else {
          user.interest = Number(user.interest) + Number(user.savings[0].cost);
          user.savings.pop();
          user.save(() => {
            res.render("saving", { user: req.user });
          });
        }
      } else {
        res.render("saving", { user: req.user });
      }
    }
  });
});

// User.findOneAndDelete({},(err)=>{
//     if(err){console.log(err)}
//     else{
//         console.log('deleted')
//     }
// })

app.get("*", (req, res) => {
  res.render("error-404");
});

let port = process.env.PORT || 5000;
app.listen(port, process.env.IP, () => {
  console.log(`Server started on port ${port}`);
});
