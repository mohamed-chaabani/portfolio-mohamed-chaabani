import { Router } from "express";
import { uploadProjectImage, uploadProfileImage } from "../middleware/upload";
import { User } from "@workspace/db";

const router = Router();

const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin123";

// Wrapper for async middleware
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error("[UPLOAD ERROR]", err);
    next(err);
  });
};

async function requireAdmin(req: any, res: any, next: any) {
  // Check legacy admin secret
  const token = req.headers["x-admin-secret"] || req.query.secret;
  if (token === ADMIN_SECRET) {
    return next();
  }

  // Check username/password headers
  const username = req.headers["x-username"];
  const password = req.headers["x-password"];

  if (!username || !password) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// Upload project image (Admin only)
router.post(
  "/project",
  asyncHandler(requireAdmin),
  uploadProjectImage,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const file = req.file as any;
    res.json({
      success: true,
      url: file.path,
      publicId: file.filename,
    });
  },
);

// Upload profile/about image (Admin only)
router.post(
  "/profile",
  asyncHandler(requireAdmin),
  uploadProfileImage,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const file = req.file as any;
    res.json({
      success: true,
      url: file.path,
      publicId: file.filename,
    });
  },
);

// Error handling middleware for multer/cloudinary errors
router.use((err: any, req: any, res: any, next: any) => {
  console.error("[UPLOAD ROUTE ERROR]", err);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large" });
  }
  if (err.message?.includes("cloudinary") || err.message?.includes("api_key")) {
    return res
      .status(500)
      .json({ error: "Cloudinary configuration error: " + err.message });
  }
  res.status(500).json({ error: err.message || "Upload failed" });
});

export default router;
