const express = require("express");
const { body } = require("express-validator");
const {
  getAccounts,
  getAccountByNumber,
  createAccount,
  updateAccount,
  uploadAccountDocuments,
  deleteAccount,
} = require("../controllers/accountController");
const { auth } = require("../middleware/auth");
const upload = require("../config/multer");

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get("/", getAccounts);
router.get("/:accountNumber", getAccountByNumber);
router.post(
  "/",
  [
    body("accountNumber")
      .isLength({ min: 17, max: 17 })
      .withMessage("Account number must be exactly 17 digits"),
  ],
  createAccount
);
router.put("/:id", updateAccount);
router.post(
  "/:id/upload-documents",
  upload.fields([
    { name: "signature", maxCount: 1 },
    { name: "nid", maxCount: 1 },
    { name: "other", maxCount: 10 },
  ]),
  uploadAccountDocuments
);
router.delete("/:id", deleteAccount);

module.exports = router;
