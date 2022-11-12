const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
  _id: { type: String },
  prefix: { type: String, default: process.env.botPrefix },
  whInsta: { type: String }
})

const Guild = model("Guild", guildSchema);
module.exports = Guild;
