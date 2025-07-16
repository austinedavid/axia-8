const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema(
  {
    displayPix: {
      type: String,
      required: true,
    },
    docType: {
      type: String,
      required: true,
    },
    frontPix: {
      type: String,
      required: true,
    },
    backPix: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const kycModel = mongoose.model("Kyc", kycSchema);

module.exports = kycModel;
