const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // folder to store files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // get file extension
    const fname = `image-${Date.now()}${ext}`;   // unique filename
    cb(null, fname);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG files are allowed"), false);
  }
};

// Create multer instance
const multerConfig = multer({
  storage,
  fileFilter,
});

module.exports = multerConfig;
