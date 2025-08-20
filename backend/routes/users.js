const express = require("express");
const { body } = require("express-validator");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { auth, adminAuth, roleAuth } = require("../middleware/auth");
const { roles, manageRoles } = require("../constants/roles");

const router = express.Router();

// All routes require admin access
router.use(roleAuth(roles));

router.get("/", roleAuth(['admin']), getUsers);

router.get("/:id", getUser);
router.post(
  "/",
  roleAuth(['admin']),
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
router.put("/:id", roleAuth(['admin']), updateUser);
router.delete("/:id", roleAuth(['admin']), deleteUser);

module.exports = router;
