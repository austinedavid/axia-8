const express = require("express");
const {
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
} = require("../controllers/user.controller");
const upload = require("../utils/multer");

// upload multiple field
const moreField = upload.fields([
  { name: "previewPix", maxCount: 1 },
  { name: "detailedPix", maxCount1: 1 },
  { name: "video", maxCount: 1 },
]);

const route = express.Router();
route.get("/", getUser);
route.post("/", createUser);
route.put("/", updateUser);
route.delete("/", deleteUser);
route.post("/user-login", loginUser);
route.get("/all-users", getAllUser);
route.post("/multi", addManyUser);
route.post("/status", statusCode);
route.post("/single", upload.single("dp"), singleFile);
route.post("/arrays", upload.array("dp", 3), arrayFile);
route.post("/multiple", moreField, multipleFile);

module.exports = route;
