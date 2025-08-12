const express = require("express");
const { body } = require("express-validator");
const { register, login, getMe } = require("../controllers/authController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  "/register",
  [
    body("employeeId").notEmpty().withMessage("Employee ID is required"),
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register
);

// @route   POST /api/auth/login
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

// @route   GET /api/auth/me
router.get("/me", auth, getMe);

module.exports = router;
