const express = require("express");
const { body } = require("express-validator");
const {
  getAgents,
  getAgentByMobile,
  createAgent,
  updateAgent,
  uploadAgentDocuments,
  deleteAgent,
} = require("../controllers/agentController");
const { auth } = require("../middleware/auth");
const upload = require("../config/multer");

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get("/", getAgents);
router.get("/mobile/:mobile", getAgentByMobile);
router.post(
  "/",
  [
    body("mobile").notEmpty().withMessage("Mobile number is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("agentType").notEmpty().withMessage("Agent type is required"),
    body("nidNumber").notEmpty().withMessage("NID number is required"),
    body("birthDate").isISO8601().withMessage("Valid birth date is required"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  createAgent
);
router.put("/:id", updateAgent);
router.post(
  "/:id/upload-documents",
  upload.fields([
    { name: "nid", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  uploadAgentDocuments
);
router.delete("/:id", deleteAgent);

module.exports = router;
