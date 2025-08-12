const express = require("express");
const { body } = require("express-validator");
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// All routes require admin access
router.use(adminAuth);

router.get("/", getEmployees);
router.get("/:id", getEmployee);
router.post(
  "/",
  [
    body("employeeId").notEmpty().withMessage("Employee ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("position").notEmpty().withMessage("Position is required"),
  ],
  createEmployee
);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
