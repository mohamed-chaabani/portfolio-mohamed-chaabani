import { Router } from "express";
import { About, Skill, Project, Category, User } from "@workspace/db";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";

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

// ─── LOGIN ───────────────────────────────────────────────────────────────────

router.post("/login", async (req, res): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password required" });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.json({ success: true });
    return;
  } catch (err: any) {
    console.error("[LOGIN ERROR]", err);
    res.status(500).json({ error: err.message || "Login failed" });
    return;
  }
});

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

router.get("/public", async (_req, res) => {
  try {
    const about = await About.findOne();
    const skills = await Skill.find().sort({ order: 1 });
    const projects = await Project.find().sort({ order: 1 });
    res.json({ about: about || null, skills, projects });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch portfolio data" });
  }
});

// ─── ABOUT ───────────────────────────────────────────────────────────────────

// Public: Get about (no auth required)
router.get("/about", async (_req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || null);
  } catch {
    res.status(500).json({ error: "Failed to fetch about" });
  }
});

// Admin only: Update about
router.put("/about", asyncHandler(requireAdmin), async (req, res) => {
  try {
    const existing = await About.findOne();
    if (existing) {
      const updated = await About.findByIdAndUpdate(
        existing._id,
        { ...req.body, updatedAt: new Date() },
        { new: true },
      );
      return res.json(updated);
    } else {
      const created = await About.create(req.body);
      return res.json(created);
    }
  } catch {
    res.status(500).json({ error: "Failed to update about" });
  }
});

// ─── SKILLS ───────────────────────────────────────────────────────────────────

// Public: Get skills (no auth required)
router.get("/skills", async (_req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.json(skills);
  } catch {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

router.post("/skills", asyncHandler(requireAdmin), async (req, res) => {
  try {
    const created = await Skill.create(req.body);
    return res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Failed to create skill" });
  }
});

router.put("/skills/:id", asyncHandler(requireAdmin), async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await Skill.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Skill not found" });
    return res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update skill" });
  }
});

router.delete("/skills/:id", asyncHandler(requireAdmin), async (req, res) => {
  try {
    const id = req.params.id;
    await Skill.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

// ─── PROJECTS ───────────────────────────────────────────────────────────────

// Public: Get projects (no auth required)
router.get("/projects", getProjects);

// Admin only: Create project (with imageUrl support)
router.post("/projects", asyncHandler(requireAdmin), createProject);

// Admin only: Update project (with imageUrl support)
router.put("/projects/:id", asyncHandler(requireAdmin), updateProject);

// Admin only: Delete project
router.delete("/projects/:id", asyncHandler(requireAdmin), deleteProject);

export default router;
