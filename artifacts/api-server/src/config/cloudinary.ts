import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage engine for Cloudinary - Projects images
const projectStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio-projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
  },
});

// Multer storage for profile/about images
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio-profile",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [{ width: 400, height: 400, crop: "fill" }],
  },
});

export { cloudinary, projectStorage, profileStorage };
