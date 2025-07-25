const express = require("express");
const userRoutes = require("./routes/user.route");
const postRoute = require("./routes/post.route");
const KycRoute = require("./routes/kyc.route");
const bookRoute = require("./routes/book.route");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const app = express();

// create connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connection was successful"))
  .catch((error) => console.log(error.message));

app.use(express.json());

const Port = process.env.PORT || 5000;

app.use(cookieParser());
// connect the mongoose below here
// creating endpoints for the student database manipulation
app.use(userRoutes);
app.use(postRoute);
app.use(KycRoute);
app.use(bookRoute);

app.use((error, req, res, next) => {
  return res
    .status(error.status || 501)
    .json({ message: error.message || "something went wrong" });
});

app.listen(Port, () => {
  console.log(`App is running in port: ${Port}`);
});
