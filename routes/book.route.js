const express = require("express");
const { createBook, getBook } = require("../controllers/book.controller");
const authentication = require("../middlewares/auth.middleware");
const route = express.Router();

route.post("/book", authentication, createBook);
route.get("/book", getBook);

module.exports = route;
