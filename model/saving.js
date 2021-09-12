const mongoose = require("mongoose");

const savingSchema = mongoose.Schema({
  startingDate: { type: Date, default: Date.now() },
  matureDate: Date,
  cost: Number,
});

module.exports = mongoose.model("Saving", savingSchema);
