const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
  _id: { type: String },
  prefix: { type: String, default: process.env.botPrefix },
  whInsta: { type: String, default: 'https://discord.com/api/webhooks/1040856682777038868/blablablabla' }
})

const Guild = model("Guild", guildSchema);
module.exports = Guild;
