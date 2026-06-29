import multer from "multer";
import { projectStorage, profileStorage } from "../config/cloudinary";

// Set up multer for PROJECT images (max 20MB)
const projectUpload = multer({
  storage: projectStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});
export const uploadProjectImage = projectUpload.single("image");

// Set up multer for PROFILE images (max 5MB)
const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
export const uploadProfileImage = profileUpload.single("image");
