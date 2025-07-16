const express = require("express");
const { createKyc, getOneKyc } = require("../controllers/kyc.controller");
const authentication = require("../middlewares/auth.middleware");
const route = express.Router();

route.post("/kyc", authentication, createKyc);
route.get("/kyc", getOneKyc);

module.exports = route;
