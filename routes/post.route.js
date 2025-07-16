const express = require("express");
const {
  createPost,
  deletePost,
  updatePost,
  getUserPosts,
  getSinglePost,
} = require("../controllers/post.controller");
const authentication = require("../middlewares/auth.middleware");
const route = express.Router();
const upload = require("../utils/multer");

const postUploads = upload.fields([
  { name: "previewPix", maxCount: 1 },
  { name: "detailedPix", maxCount: 1 },
]);

route.post("/post", postUploads, authentication, createPost);
route.delete("/post", authentication, deletePost);
route.put("/post", authentication, updatePost);
route.get("/get-all-post", getUserPosts);
route.get("/single-post", getSinglePost);

module.exports = route;
