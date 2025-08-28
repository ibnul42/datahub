const express = require("express");
const { body } = require("express-validator");
const {
  getCustomers,
  getCustomerByNID,
  createCustomer,
  updateCustomer,
  uploadCustomerNID,
  deleteCustomer,
  uploadCustomerPhoto,
} = require("../controllers/customerController");
const { auth, roleAuth } = require("../middleware/auth");
const upload = require("../config/multer");
const { roles, customerCrud } = require("../constants/roles");

const router = express.Router();

router.use(roleAuth(roles));
router.get("/", getCustomers);
router.get("/nid/:nidNumber", getCustomerByNID);
router.use(roleAuth(customerCrud));
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
router.post("/:id/upload-nid", upload.uploadNID.single("nid"), uploadCustomerNID);
router.post("/:id/upload-photo", upload.uploadPhoto.single("photo"), uploadCustomerPhoto);
router.delete("/:id", deleteCustomer);

module.exports = router;
