const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

// Load env vars
dotenv.config({ path: __dirname + "/.env" });

const connectDB = require("./config/database");

// Route imports
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const employeeRoutes = require("./routes/employees");
const customerRoutes = require("./routes/customers");
const agentRoutes = require("./routes/agents");
// const accountRoutes = require("./routes/accounts");

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Define allowed origins
const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://yourdomain.com"]
  : [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
    ];

// CORS setup for all routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// Handle preflight requests
app.options('*', cors());

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Get the upload directories from multer config
const { uploadNID, uploadPhoto } = require("./config/multer");
const nidsPath = path.join(__dirname, "uploads/nids");
const photosPath = path.join(__dirname, "uploads/photos");

// Ensure directories exist
[nidsPath, photosPath].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static files from the backend directory
app.use("/uploads/nids", express.static(nidsPath));
app.use("/uploads/photos", express.static(photosPath));

// Add CORS headers to static file requests
app.use("/uploads", (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/agents", agentRoutes);
// app.use("/api/accounts", accountRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DataHub API is running",
    timestamp: new Date().toISOString(),
    uploadPaths: {
      nids: nidsPath,
      photos: photosPath
    }
  });
});

// Debug endpoint to check file upload directories
app.get("/api/debug/uploads", (req, res) => {
  const listFiles = (dir) => {
    try {
      return fs.existsSync(dir) ? fs.readdirSync(dir) : [];
    } catch (error) {
      return [`Error reading directory: ${error.message}`];
    }
  };

  res.json({
    nidsDirectory: nidsPath,
    nidsFiles: listFiles(nidsPath),
    photosDirectory: photosPath,
    photosFiles: listFiles(photosPath),
    exists: {
      nids: fs.existsSync(nidsPath),
      photos: fs.existsSync(photosPath)
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // CORS error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy: Request not allowed",
      allowedOrigins: allowedOrigins
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: "Validation Error", errors });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: "Duplicate field value entered" });
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: "File too large" });
  }

  // Multer file filter error
  if (err.message.includes('Only image')) {
    return res.status(400).json({ message: err.message });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ 
    success: false,
    message: "API endpoint not found" 
  });
});

// 404 handler for all other routes
app.use("*", (req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Route not found" 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});