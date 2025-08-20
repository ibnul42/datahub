const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { employeeId, username, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { employeeId }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      employeeId,
      username,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        employeeId: user.employeeId,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = { ...req.body };

    // Validate role
    const validRoles = [
      "admin",
      "In-Charge",
      "Assistance In-Charge",
      "Cash In-charge",
      "Senior Desk Officer(SDO)",
      "Desk Officer(DO)",
      "Marketing Office(MO)",
      "Sales Office(SR)",
    ];
    if (updates.role && !validRoles.includes(updates.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Validate status
    const validStatus = ["active", "inactive"];
    if (updates.status && !validStatus.includes(updates.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Apply updates dynamically
    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    // Save user - this will trigger pre('save') hook for hashing password if modified
    await user.save();

    // Remove password before sending response
    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      data: userObj,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
