const Account = require("../models/Account");
const { validationResult } = require("express-validator");

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private
const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: accounts.length,
      data: accounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get account by account number
// @route   GET /api/accounts/:accountNumber
// @access  Private
const getAccountByNumber = async (req, res) => {
  try {
    const account = await Account.findOne({
      accountNumber: req.params.accountNumber,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create account
// @route   POST /api/accounts
// @access  Private
const createAccount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const account = await Account.create(req.body);

    res.status(201).json({
      success: true,
      data: account,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Account number already exists" });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
const updateAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Upload account documents
// @route   POST /api/accounts/:id/upload-documents
// @access  Private
const uploadAccountDocuments = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const updates = {};
    if (req.files.signature) {
      updates["documentFiles.signature"] = req.files.signature[0].filename;
      updates["documents.signature"] = true;
    }
    if (req.files.nid) {
      updates["documentFiles.nid"] = req.files.nid[0].filename;
      updates["documents.nid"] = true;
    }
    if (req.files.other) {
      updates["documentFiles.other"] = req.files.other.map(
        (file) => file.filename
      );
      updates["documents.other"] = true;
    }

    const account = await Account.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      success: true,
      data: account,
      message: "Documents uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAccounts,
  getAccountByNumber,
  createAccount,
  updateAccount,
  uploadAccountDocuments,
  deleteAccount,
};
