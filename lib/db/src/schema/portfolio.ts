import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const portfolioAbout = pgTable("portfolio_about", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Alex Morgan"),
  title: text("title").notNull().default("Full Stack Developer"),
  phrases: text("phrases").array().notNull().default([]),
  bio: text("bio").notNull().default(""),
  email: text("email").notNull().default(""),
  github: text("github").notNull().default(""),
  linkedin: text("linkedin").notNull().default(""),
  twitter: text("twitter").notNull().default(""),
  yearsExperience: integer("years_experience").notNull().default(5),
  projectsCompleted: integer("projects_completed").notNull().default(50),
  happyClients: integer("happy_clients").notNull().default(30),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const portfolioSkills = pgTable("portfolio_skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  order: integer("order").notNull().default(0),
});

export const portfolioProjects = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  githubUrl: text("github_url").notNull().default(""),
  liveUrl: text("live_url").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull().default(0),
});

export const insertAboutSchema = createInsertSchema(portfolioAbout).omit({ id: true, updatedAt: true });
export const insertSkillSchema = createInsertSchema(portfolioSkills).omit({ id: true });
export const insertProjectSchema = createInsertSchema(portfolioProjects).omit({ id: true });

export type About = typeof portfolioAbout.$inferSelect;
export type InsertAbout = z.infer<typeof insertAboutSchema>;
export type Skill = typeof portfolioSkills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Project = typeof portfolioProjects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
