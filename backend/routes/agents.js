const express = require("express");
const { body } = require("express-validator");
const {
  getAgents,
  getAgentByMobile,
  createAgent,
  updateAgent,
  uploadAgentDocuments,
  deleteAgent,
  uploadAgentPhoto,
  uploadAgentNID,
} = require("../controllers/agentController");
const { auth } = require("../middleware/auth");
const { uploadNID, uploadPhoto } = require("../config/multer"); // Import specific uploaders

const router = express.Router();

// All routes require authentication
// router.use(auth);

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

// Separate upload endpoints for better control
router.post("/:id/upload-nid", uploadNID.single("nid"), uploadAgentNID);
router.post("/:id/upload-photo", uploadPhoto.single("photo"), uploadAgentPhoto);

// Keep the combined upload for backward compatibility if needed
router.post(
  "/:id/upload-documents",
  uploadNID.fields([
    { name: "nid", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  uploadAgentDocuments
);

router.delete("/:id", deleteAgent);

module.exports = router;