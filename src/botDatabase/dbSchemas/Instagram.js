const { Schema, model } = require('mongoose');

const instaSchema = new Schema({
  _id: { type: String },
  autorFoto: { type: String, default: null },
  likesFoto: { type: Number, default: 0 },
  curtidoresFoto: { type: Array, default: [] },
  comentariosFoto: { type: Array, default: [] },
});

const Insta = model('Insta', instaSchema);
module.exports = Insta;
