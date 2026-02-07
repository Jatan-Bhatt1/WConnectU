import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root (middleware is in src/middleware, so go up 2 levels)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Debug: verify env vars are loaded
console.log("Cloudinary Config Check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing",
  api_key: process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing",
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wconnectu_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
    format: "webp", // Convert to webp for smaller file size
    transformation: [
      { width: 1000, crop: "limit" }, // Limit max width
      { quality: "auto:low" }, // Auto quality optimization (favor speed)
      { fetch_format: "auto" }, // Auto format based on browser
    ],
  },
});

export const upload = multer({ storage: storage });
