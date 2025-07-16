const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const cloudinary = require("../utils/cloudinary");

const createUser = async (req, res, next) => {
  // get the persons registration details and spread others
  const { email, password, ...others } = req.body;
  // check if email and password exists
  if (!email || !password) {
    const error = new Error("provide the neccessasy field");
    error.status = 400;
    next(error);
  }
  // check if user exist in our database
  // const isUser = await userModel.findOne({ email });
  // if (isUser) {
  //   return res.send("User already exists, please login to your account");
  // }
  // continue with registration.
  try {
    const newUser = new userModel({
      email,
      password,
      ...others,
    });
    const savedUser = await newUser.save();
    return res.json(savedUser);
  } catch (error) {
    return next(error);
  }
};
const getUser = async (req, res) => {
  const allUsers = await userModel.find();
  return res.json(allUsers);
};

const updateUser = async (req, res) => {
  const { id, ...others } = req.body;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { ...others },
      { new: true }
    );
    return res.json(updatedUser);
  } catch (error) {}
};

const deleteUser = async (req, res) => {
  const { id } = req.query;
  const deletedUser = await userModel.findByIdAndDelete(id);
  return res.json(deletedUser);
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // get the user from database
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.send("this account does not exist, create account!!!");
  }
  // comapare password
  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    return res.send("Invalid password!!!");
  }
  // create a token first
  const token = jwt.sign(
    { id: user.id, admin: user.admin },
    process.env.JWT_SECRET,
    { expiresIn: "2hr" }
  );
  // return basic information
  res.cookie("token", token, {
    maxAge: 1000 * 60 * 60,
    secure: true,
    httpOnly: true,
  });
  return res.json({ message: "this was successful" });
};

const getAllUser = async (req, res) => {
  try {
    const users = await userModel.aggregate([
      {
        $match: {
          gender: "Male",
          age: { $gt: 17 },
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          name: 1,
          _id: 0,
          email: 1,
          age: 1,
          gender: 1,
        },
      },
      {
        $sort: {
          age: -1,
        },
      },
    ]);
    return res.json(users);
  } catch (error) {
    return res.send("something went wrong");
  }
};

const addManyUser = async (req, res) => {
  const allUser = [
    {
      email: "austinedavid839hsdl99@gmail.com",
      name: "multi 1",
      age: 20,
      password: "555556",
      gender: "Male",
    },
    {
      email: "austinedavid839hsdl910@gmail.com",
      name: "multi 2",
      age: 20,
      password: "555556",
      gender: "Male",
    },
    {
      email: "austinedavid839hsdl9m5@gmail.com",
      name: "multi 3",
      age: 20,
      password: "555556",
      gender: "Male",
    },
  ];
  const insertedUser = await userModel.insertMany(allUser);
  res.send("users added successfully");
};

const statusCode = async (req, res, next) => {
  console.log(req.body);
  return res.send("received");
};

// upload single file field
const singleFile = async (req, res, next) => {
  try {
    const response = await cloudinary.uploader.upload(req.file.path, {
      folder: "video",
      resource_type: "video",
    });
    console.log(response);
    await fs.unlink(req.file.path);
    return res.send("successful");
  } catch (error) {
    await fs.unlink(req.file.path);
    next(error);
  }
};

// uploading array files
const arrayFile = async (req, res) => {
  const file = req.files;
  console.log(file);
  const uploadedPix = [];
  console.log(uploadedPix);
  for (const x of file) {
    const response = await cloudinary.uploader.upload(x.path);
    uploadedPix.push(response.secure_url);
    await fs.unlink(x.path);
  }
  body["previewPix"] = uploadedPix[0];
  body["detailedPix"] = uploadedPix[1];
  return res.send("successful");
};

// multiple files
const multipleFile = async (req, res) => {
  console.log(req.files);
  console.log(req.body);
  return res.send("successful");
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getAllUser,
  addManyUser,
  statusCode,
  singleFile,
  arrayFile,
  multipleFile,
};
