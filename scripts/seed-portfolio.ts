import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../lib/db/src/schema/index.js";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seed() {
  console.log("Seeding portfolio data...");

  // About
  const [existing] = await db.select().from(schema.portfolioAbout).limit(1);
  if (!existing) {
    await db.insert(schema.portfolioAbout).values({
      name: "Alex Morgan",
      title: "Full Stack Developer",
      subtitle: "I build scalable web experiences",
      bio: "Hello! My name is Alex and I enjoy creating things that live on the internet. My interest in web development started back in 2015 when I decided to try editing custom Tumblr themes — turns out hacking together HTML & CSS taught me a lot about logic and structure!\n\nFast-forward to today, and I've had the privilege of working at an advertising agency, a start-up, a huge corporation, and a studio-led design studio. My main focus these days is building accessible, inclusive products and digital experiences.",
      email: "alex@example.com",
      github: "https://github.com/alexmorgan",
      linkedin: "https://linkedin.com/in/alexmorgan",
      twitter: "https://twitter.com/alexmorgan",
      yearsExperience: 8,
      projectsCompleted: 50,
      happyClients: 30,
    });
    console.log("✓ About seeded");
  }

  // Skills
  const existingSkills = await db.select().from(schema.portfolioSkills);
  if (existingSkills.length === 0) {
    await db.insert(schema.portfolioSkills).values([
      { name: "React", category: "Frontend", order: 1 },
      { name: "Next.js", category: "Frontend", order: 2 },
      { name: "TypeScript", category: "Frontend", order: 3 },
      { name: "Tailwind CSS", category: "Frontend", order: 4 },
      { name: "Three.js", category: "Frontend", order: 5 },
      { name: "Framer Motion", category: "Frontend", order: 6 },
      { name: "Redux", category: "Frontend", order: 7 },
      { name: "GraphQL", category: "Frontend", order: 8 },
      { name: "Node.js", category: "Backend", order: 1 },
      { name: "Express", category: "Backend", order: 2 },
      { name: "Python", category: "Backend", order: 3 },
      { name: "Django", category: "Backend", order: 4 },
      { name: "PostgreSQL", category: "Backend", order: 5 },
      { name: "MongoDB", category: "Backend", order: 6 },
      { name: "Redis", category: "Backend", order: 7 },
      { name: "REST APIs", category: "Backend", order: 8 },
      { name: "Docker", category: "DevOps & Tools", order: 1 },
      { name: "AWS", category: "DevOps & Tools", order: 2 },
      { name: "GCP", category: "DevOps & Tools", order: 3 },
      { name: "CI/CD", category: "DevOps & Tools", order: 4 },
      { name: "GitHub Actions", category: "DevOps & Tools", order: 5 },
      { name: "Linux", category: "DevOps & Tools", order: 6 },
      { name: "Figma", category: "DevOps & Tools", order: 7 },
      { name: "Nginx", category: "DevOps & Tools", order: 8 },
    ]);
    console.log("✓ Skills seeded");
  }

  // Projects
  const existingProjects = await db.select().from(schema.portfolioProjects);
  if (existingProjects.length === 0) {
    await db.insert(schema.portfolioProjects).values([
      {
        title: "DevFlow",
        description: "Full-stack project management tool built for developer teams with real-time collaboration.",
        longDescription: "DevFlow is a project management platform specifically designed for software development teams. It features real-time collaboration, sprint planning, automated status updates from CI/CD pipelines, and deep GitHub integration.",
        tags: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        imageUrl: "",
        featured: true,
        order: 1,
      },
      {
        title: "NeuralChat",
        description: "AI-powered chat application with custom language model integration and real-time streaming.",
        longDescription: "NeuralChat is an AI-powered conversational platform that integrates multiple language models with a clean chat interface. Features include streaming responses, conversation history, prompt engineering tools.",
        tags: ["React", "Python", "FastAPI", "OpenAI"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        imageUrl: "",
        featured: true,
        order: 2,
      },
      {
        title: "CryptoVault",
        description: "Secure cryptocurrency portfolio tracker with real-time market data and analytics dashboard.",
        longDescription: "CryptoVault is a comprehensive cryptocurrency portfolio management application that provides real-time market data, performance analytics, and portfolio rebalancing tools.",
        tags: ["Vue.js", "Node.js", "Redis", "WebSockets"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        imageUrl: "",
        featured: false,
        order: 3,
      },
    ]);
    console.log("✓ Projects seeded");
  }

  console.log("Seeding complete!");
  await pool.end();
}

seed().catch(console.error);
