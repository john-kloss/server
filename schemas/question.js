const mongoose = require("mongoose");

module.exports = questionSchema = mongoose.Schema({
  question: String,
  answers: Array,
  university: String,
  course: String,
  subject: String,
  live: Boolean
});
