const express = require("express");
const { body } = require("express-validator");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// All routes require admin access
router.use(adminAuth);

router.get("/", getUsers);
router.get("/:id", getUser);
router.post(
  "/",
  [
    body("employeeId").notEmpty().withMessage("Employee ID is required"),
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role").notEmpty().withMessage("Role is required"),
  ],
  createUser
);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
