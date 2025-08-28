const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Use absolute paths within the backend directory
const uploadDirs = {
  nids: path.join(__dirname, "../uploads/nids"),
  photos: path.join(__dirname, "../uploads/photos"),
};

// Ensure upload directories exist
Object.values(uploadDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log("NID upload directory:", uploadDirs.nids);
console.log("Photo upload directory:", uploadDirs.photos);

// Common file filter
const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and PDF files are allowed!"), false);
  }
};

// Image-only file filter (for user photos)
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for photos!"), false);
  }
};

// Storage configuration for NID files
const nidStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirs.nids);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "nid-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Storage configuration for user photos
const photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirs.photos);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "photo-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Create upload instances
const uploadNID = multer({
  storage: nidStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter, // Allows both images and PDFs for NID
});

const uploadPhoto = multer({
  storage: photoStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_PHOTO_SIZE) || 2 * 1024 * 1024, // 2MB for photos
  },
  fileFilter: imageFilter, // Only allows images for photos
});

// Default upload (for backward compatibility)
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirs.nids); // Default to NID directory
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  }),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

module.exports = {
  upload,
  uploadNID,
  uploadPhoto,
};
