import { Router } from "express";
import { User } from "@workspace/db";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

const router = Router();

const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin123";

// Wrapper for async middleware
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
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

// Public: Get categories
router.get("/", getCategories);

// Admin only: Create category
router.post("/", asyncHandler(requireAdmin), createCategory);

// Admin only: Update category
router.put("/:id", asyncHandler(requireAdmin), updateCategory);

// Admin only: Delete category
router.delete("/:id", asyncHandler(requireAdmin), deleteCategory);

export default router;
