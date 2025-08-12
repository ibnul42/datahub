const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 17,
      maxlength: 17,
    },
    accountStatus: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active",
    },
    status: {
      type: String,
      enum: ["Complete", "Pending", "Processing"],
      default: "Pending",
    },
    documents: {
      signature: { type: Boolean, default: false },
      nid: { type: Boolean, default: false },
      other: { type: Boolean, default: false },
    },
    documentFiles: {
      signature: String,
      nid: String,
      other: [String],
    },
    description: {
      type: String,
      default: "Awaiting documents",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);
