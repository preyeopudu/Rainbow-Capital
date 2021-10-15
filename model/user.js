const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Receipt = require("./receipt");
const Plan = require("./plan");
const Referal = require("./referal");
const Saving = require("./saving");
const Image=require('./images')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  referee: String, //User who referred you

  //wallets
  interest: { type: Number, default: 0 },
  deposit: { type: Number, default: 0 },
  lockedFund: { type: Number, default: 0 },
  referalEarnings: { type: Number, default: 0 },

  isReferred: { type: Boolean, default: false },
  isOnPlan:{ type: Boolean, default: false },
  referee: String,

  image:[Image.schema],
  plan: [Plan.schema],
  receipt: [Receipt.schema],
  referals: [Referal.schema],
  savings: [Saving.schema],

  message: Boolean,
  bonus: { type: Boolean, default: false },
  notice: { type: Boolean, default: true },
  shared: { type: Boolean, default: false },

  ip: String, //ip address of user
  previous: { type: Number, default: 0 }, //previous user plan
  secretCode: String,
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
