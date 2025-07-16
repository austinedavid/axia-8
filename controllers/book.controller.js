const bookModel = require("../models/book.model");
const userModel = require("../models/user.model");

const createBook = async (req, res) => {
  const { authors, ...others } = req.body;
  const { id } = req.user;
  const allAuthors = [...authors, id];
  try {
    // go ahead and create book
    const newBook = new bookModel({ authors: allAuthors, ...others });
    const savedBook = await newBook.save();
    // update the users information
    for (const authorId of allAuthors) {
      await userModel.findByIdAndUpdate(
        authorId,
        { $push: { books: savedBook.id } },
        { new: true }
      );
    }
    return res.send("book created successfully");
  } catch (error) {
    return res.send("something went wrong");
  }
};

const getBook = async (req, res) => {
  const { bookId } = req.query;
  try {
    const book = await bookModel.findById(bookId).populate("authors");
    return res.json(book);
  } catch (error) {
    return res.send("something went wrong");
  }
};

module.exports = { createBook, getBook };
