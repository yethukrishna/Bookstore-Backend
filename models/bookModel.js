const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  noofpages: { type: Number, required: true },
  imageurl: { type: String, required: true },
  price: { type: Number, required: true },
  dPrice: { type: Number, required: true },
  Abstract: { type: String, required: true },
  publisher: { type: String, required: true },
  language: { type: String, required: true },
  isbn: { type: String, required: true },
  category: { type: String, required: true },
  uploadedImg: { type: [String], default: [] },
  status: { type: String, default: "pending" },
  userMail: { type: String, required: true },
  brought: { type: String, default: "" },
});

const Book = mongoose.model("books", bookSchema);
module.exports = Book;
