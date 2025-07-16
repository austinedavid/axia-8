const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  authors: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

const bookModel = mongoose.model("Book", bookSchema);
module.exports = bookModel;
