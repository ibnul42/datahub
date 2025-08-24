const express = require("express");
const { body } = require("express-validator");
const {
  getCustomers,
  getCustomerByNID,
  createCustomer,
  updateCustomer,
  uploadCustomerNID,
  deleteCustomer,
} = require("../controllers/customerController");
const { auth, roleAuth } = require("../middleware/auth");
const upload = require("../config/multer");

const router = express.Router();

// All routes require authentication
router.use(roleAuth(['admin']));

router.get("/", getCustomers);
router.get("/nid/:nidNumber", getCustomerByNID);
router.post(
  "/",
  [
    body("nidNumber").notEmpty().withMessage("NID number is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("mobile").notEmpty().withMessage("Mobile number is required"),
    body("birthDate").isISO8601().withMessage("Valid birth date is required"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  createCustomer
);
router.put("/:id", updateCustomer);
router.post("/:id/upload-nid", upload.single("nid"), uploadCustomerNID);
router.delete("/:id", deleteCustomer);

module.exports = router;
