const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    age: {
      type: Number,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    hobbies: {
      type: [String],
    },
    kyc: {
      type: mongoose.Types.ObjectId,
      ref: "Kyc",
    },
    posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
    books: [{ type: mongoose.Types.ObjectId, ref: "Book" }],
  },
  { timestamps: true }
);

// mongoose middleware

// document middleware examples
userSchema.pre("save", function (next) {
  const hashedPassword = bcrypt.hashSync(this.password, 10);
  this.password = hashedPassword;
  next();
});
userSchema.pre("validate", function (next) {
  console.log("something happened2");
  next();
});
userSchema.post("save", function (doc, next) {
  console.log(doc);
  console.log("sent email to the user");
  next();
});

// model middleware example
userSchema.pre("insertMany", function (next) {
  console.log("inserted many documents!!!");
  next();
});

userSchema.post("insertMany", function (doc, next) {
  console.log(doc);
  next();
});

// query middleware
userSchema.pre("findOne", function () {
  console.log("finding one user!!!");
});
userSchema.pre("find", function () {
  console.log("getting all the users");
});

// aggregation
userSchema.pre("aggregate", function () {
  console.log("aggregation happened here!!!");
});

// create model
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
