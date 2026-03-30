import { Router } from "express";
import { db } from "@workspace/db";
import {
  portfolioAbout,
  portfolioSkills,
  portfolioProjects,
  insertAboutSchema,
  insertSkillSchema,
  insertProjectSchema,
} from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin123";

function requireAdmin(req: any, res: any, next: any) {
  const token = req.headers["x-admin-secret"] || req.query.secret;
  if (token !== ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

router.get("/public", async (_req, res) => {
  try {
    const [about] = await db.select().from(portfolioAbout).limit(1);
    const skills = await db.select().from(portfolioSkills).orderBy(portfolioSkills.order);
    const projects = await db.select().from(portfolioProjects).orderBy(portfolioProjects.order);
    res.json({ about: about || null, skills, projects });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch portfolio data" });
  }
});

// ─── ADMIN: ABOUT ─────────────────────────────────────────────────────────────

router.get("/about", requireAdmin, async (_req, res) => {
  try {
    const [about] = await db.select().from(portfolioAbout).limit(1);
    res.json(about || null);
  } catch {
    res.status(500).json({ error: "Failed to fetch about" });
  }
});

router.put("/about", requireAdmin, async (req, res) => {
  try {
    const parsed = insertAboutSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const [existing] = await db.select().from(portfolioAbout).limit(1);
    if (existing) {
      const [updated] = await db
        .update(portfolioAbout)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(eq(portfolioAbout.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(portfolioAbout).values(parsed.data as any).returning();
      res.json(created);
    }
  } catch {
    res.status(500).json({ error: "Failed to update about" });
  }
});

// ─── ADMIN: SKILLS ────────────────────────────────────────────────────────────

router.get("/skills", requireAdmin, async (_req, res) => {
  try {
    const skills = await db.select().from(portfolioSkills).orderBy(portfolioSkills.order);
    res.json(skills);
  } catch {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

router.post("/skills", requireAdmin, async (req, res) => {
  try {
    const parsed = insertSkillSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const [created] = await db.insert(portfolioSkills).values(parsed.data).returning();
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Failed to create skill" });
  }
});

router.put("/skills/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = insertSkillSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const [updated] = await db.update(portfolioSkills).set(parsed.data).where(eq(portfolioSkills.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Skill not found" });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update skill" });
  }
});

router.delete("/skills/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(portfolioSkills).where(eq(portfolioSkills.id, id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

// ─── ADMIN: PROJECTS ──────────────────────────────────────────────────────────

router.get("/projects", requireAdmin, async (_req, res) => {
  try {
    const projects = await db.select().from(portfolioProjects).orderBy(portfolioProjects.order);
    res.json(projects);
  } catch {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.post("/projects", requireAdmin, async (req, res) => {
  try {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const [created] = await db.insert(portfolioProjects).values(parsed.data).returning();
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.put("/projects/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = insertProjectSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const [updated] = await db.update(portfolioProjects).set(parsed.data).where(eq(portfolioProjects.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Project not found" });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/projects/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
