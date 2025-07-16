const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs/promises");

const createPost = async (req, res) => {
  const body = req.body;
  const file = req.files;
  const { id } = req.user;
  try {
    // upload to cloudinary first
    const previewPixResponse = await cloudinary.uploader.upload(
      file["previewPix"][0].path
    );
    const detailedPixResponse = await cloudinary.uploader.upload(
      file["detailedPix"][0].path
    );
    console.log(previewPixResponse.secure_url);
    console.log(detailedPixResponse.secure_url);
    // append the uploaded field to the body
    body["previewPix"] = previewPixResponse.secure_url;
    body["detailedPix"] = detailedPixResponse.secure_url;

    console.log(body);
    // create a post
    const newPost = new postModel({
      creator: id,
      ...body,
    });
    const savedPost = await newPost.save();
    // modify the user account
    await userModel.findByIdAndUpdate(
      id,
      { $push: { posts: savedPost.id } },
      { new: true }
    );
    await fs.unlink(file["previewPix"][0].path);
    await fs.unlink(file["detailedPix"][0].path);
    return res.send("post created successfully!!!");
  } catch (error) {
    await fs.unlink(file["previewPix"][0].path);
    await fs.unlink(file["detailedPix"][0].path);
    return res.send(error.message);
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.query;
  const { id, admin } = req.user;
  console.log(req.user);
  // check for post existence
  const post = await postModel.findById(postId);
  if (!post) {
    return res.send("post does not exist");
  }
  // check if is the creator
  if (id != post.creator && !admin) {
    return res.send("this post does not belong to you");
  }
  try {
    await postModel.findByIdAndDelete(postId);
    return res.send("post deleted successfully!!!");
  } catch (error) {
    return res.send(error.message);
  }
};

// update a post
const updatePost = async (req, res) => {
  const { postId, userId } = req.query;
  const body = req.body;
  // get the post
  const post = await postModel.findById(postId);
  if (!post) {
    return res.send("post does not exist");
  }
  // check if is the owner
  if (userId != post.creator) {
    return res.send("you can only update your post");
  }

  try {
    await postModel.findByIdAndUpdate(postId, { ...body }, { new: true });
    res.send("post updated successfully");
  } catch (error) {
    res.send("something went wrong");
  }
};

// get all the post
const getUserPosts = async (req, res) => {
  const { userId } = req.query;
  try {
    const posts = await postModel.find({ creator: userId });
    return res.json(posts);
  } catch (error) {
    return res.send("something went wrong");
  }
};

// get a single post
const getSinglePost = async (req, res) => {
  const { postId } = req.query;
  try {
    const post = await postModel.findById(postId).populate("creator");
    return res.json(post);
  } catch (error) {
    return res.send("something went wrong");
  }
};

module.exports = {
  createPost,
  deletePost,
  updatePost,
  getUserPosts,
  getSinglePost,
};

// Header = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
// Payload = eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0
// secret = david
// signature = Header + Payload
// skkskskskkskskskkskskskskkskskkskskksksk
