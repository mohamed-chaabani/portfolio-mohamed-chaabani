"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowRight,
  Send,
  Terminal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useInView } from "@/hooks/use-in-view";

import { CanvasParticles } from "@/components/CanvasParticles";
import { TypingEffect } from "@/components/TypingEffect";
import { Navbar } from "@/components/Navbar";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ProjectCard } from "@/components/ProjectCard";

// ─── Types ────────────────────────────────────────────────────────────────────

type About = {
  name: string;
  title: string;
  phrases: string[];
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  yearsExperience: number;
  projectsCompleted: number;
  happyClients: number;
};

type Skill = { id: number; name: string; category: string };
type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl?: string;
  featured: boolean;
};

type Category = { id: number; name: string };

type PortfolioData = {
  about: About | null;
  skills: Skill[];
  projects: Project[];
  categories: Category[];
};

// ─── Fallback data (shown while loading) ─────────────────────────────────────

const FALLBACK: PortfolioData = {
  about: {
    name: "Alex Morgan",
    title: "Full Stack Developer",
    phrases: [
      "scalable web apps.",
      "high-performance APIs.",
      "beautiful user interfaces.",
    ],
    bio: "A full-stack engineer specializing in building exceptional digital experiences.",
    email: "hello@example.com",
    github: "#",
    linkedin: "#",
    twitter: "#",
    yearsExperience: 8,
    projectsCompleted: 50,
    happyClients: 30,
  },
  skills: [],
  projects: [],
  categories: [],
};

// ─── Category config ──────────────────────────────────────────────────────────

const CAT_CONFIG: Record<
  string,
  {
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  Frontend: {
    icon: "⚡",
    color: "rgb(0,200,255)",
    bgColor: "rgba(0,200,255,0.03)",
    borderColor: "rgba(0,200,255,0.3)",
    textColor: "rgba(0,200,255,0.9)",
  },
  Backend: {
    icon: "🛠",
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.03)",
    borderColor: "rgba(139,92,246,0.3)",
    textColor: "rgba(139,92,246,0.9)",
  },
  "DevOps & Tools": {
    icon: "🚀",
    color: "#10b981",
    bgColor: "rgba(34,197,94,0.03)",
    borderColor: "rgba(34,197,94,0.3)",
    textColor: "rgba(52,211,153,0.9)",
  },
};

// Fallback config for unknown categories
const FALLBACK_CAT_CONFIG = {
  icon: "💻",
  color: "#6b7280",
  bgColor: "rgba(107,114,128,0.03)",
  borderColor: "rgba(107,114,128,0.3)",
  textColor: "rgba(156,163,175,0.9)",
};

const getCatConfig = (cat: string) => CAT_CONFIG[cat] || FALLBACK_CAT_CONFIG;

// ─── Contact form ─────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactFormValues = z.infer<typeof contactSchema>;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<PortfolioData>(FALLBACK);
  const [loading, setLoading] = useState(true);

  const [aboutRef, aboutInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [contactRef, contactInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  // Fetch portfolio data from API
  useEffect(() => {
    console.log("Fetching from API...");
    fetch("/api/portfolio/public")
      .then((res) => {
        console.log("API response status:", res.status);
        return res.ok ? res.json() : null;
      })
      .then((json) => {
        console.log("API data:", json);
        if (json) setData(json);
      })
      .catch((err) => {
        console.error("API error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const { about, skills, projects, categories: apiCategories } = data;

  // Use categories from API (only ones that exist in DB)
  const categories = apiCategories?.map((c) => c.name);
  const skillsByCategory = categories?.reduce(
    (acc, cat) => {
      acc[cat] = skills.filter((s) => s.category === cat);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  // If no skills from API yet, show nothing (section still renders)
  const hasSkills = skills.length > 0;

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({
      title: "Message Transmitted",
      description: "Thanks for reaching out! I'll get back to you soon.",
      variant: "default",
    });
    form.reset();
  };

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <CanvasParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start mt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-display text-sm font-medium mb-6 animate-in-up is-visible">
            <Terminal size={16} />
            <span>System Ready _</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display text-white tracking-tighter mb-4 animate-in-up is-visible delay-100">
            {about?.name?.split(" ")[0] || "Alex"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {about?.name?.split(" ").slice(1).join(" ") || "Morgan"}
            </span>
          </h1>

          <div className="text-xl md:text-3xl lg:text-4xl text-muted-foreground font-medium mb-8 animate-in-up is-visible delay-200 h-[40px] md:h-[56px]">
            <span className="mr-3">I build</span>
            {!loading && (
              <TypingEffect
                words={
                  about?.phrases?.length
                    ? about.phrases
                    : [
                        "scalable web apps.",
                        "high-performance APIs.",
                        "beautiful user interfaces.",
                      ]
                }
              />
            )}
          </div>

          <p className="max-w-xl text-lg text-muted-foreground/80 leading-relaxed mb-10 animate-in-up is-visible delay-300">
            {about?.bio?.split("\n")[0] ||
              "A full-stack engineer specializing in building exceptional digital experiences."}
          </p>

          <div className="flex flex-wrap gap-4 animate-in-up is-visible delay-400">
            <button
              onClick={() => scrollTo("#projects")}
              className="px-8 py-4 bg-primary text-primary-foreground font-display font-bold tracking-wider uppercase rounded-lg hover:bg-primary/90 transition-all box-glow flex items-center gap-2 group"
            >
              View Work
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={() => scrollTo("#contact")}
              className="px-8 py-4 bg-transparent text-white font-display font-bold tracking-wider uppercase rounded-lg border-2 border-white/20 hover:border-white/60 hover:bg-white/5 transition-all"
            >
              Contact Me
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float opacity-70">
          <span className="text-xs font-display uppercase tracking-widest text-muted-foreground">
            Scroll
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* ─── ABOUT ────────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              ref={aboutRef as any}
              className={`animate-in-up ${aboutInView ? "is-visible" : ""}`}
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 flex items-center gap-4">
                <span className="text-primary text-2xl md:text-3xl font-normal">
                  01.
                </span>
                About Me
                <div className="h-[1px] flex-grow bg-white/10 ml-4 hidden sm:block"></div>
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                {about?.bio ? (
                  about.bio
                    .split("\n\n")
                    .filter(Boolean)
                    .map((para, i) => <p key={i}>{para.trim()}</p>)
                ) : (
                  <p>
                    A full-stack engineer specializing in building exceptional
                    digital experiences.
                  </p>
                )}
              </div>

              {/* Social links */}
              <div className="flex gap-4 mt-8">
                {about?.github && about.github !== "#" && (
                  <a
                    href={about.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
                  >
                    <Github size={20} />
                  </a>
                )}
                {about?.linkedin && about.linkedin !== "#" && (
                  <a
                    href={about.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
                {about?.twitter && about.twitter !== "#" && (
                  <a
                    href={about.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
                  >
                    <Twitter size={20} />
                  </a>
                )}
                {about?.email && (
                  <a
                    href={`mailto:${about.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
                  >
                    <Mail size={20} />
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <AnimatedCounter
                end={about?.projectsCompleted ?? 50}
                suffix="+"
                label="Projects"
              />
              <AnimatedCounter
                end={about?.yearsExperience ?? 8}
                suffix="+"
                label="Years Exp"
                duration={1500}
              />
              <AnimatedCounter
                end={about?.happyClients ?? 30}
                suffix="+"
                label="Clients"
                duration={2500}
              />
              <AnimatedCounter
                end={10}
                suffix="+"
                label="Tech Stack"
                duration={2000}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SKILLS ───────────────────────────────────────────────────────── */}
      <section
        id="skills"
        className="py-24 md:py-32 relative border-y border-white/5"
        style={{ background: "rgba(6,13,20,0.6)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-16 flex items-center gap-4">
            <span className="text-primary text-2xl md:text-3xl font-normal">
              02.
            </span>
            Technical Arsenal
            <div className="h-[1px] flex-grow bg-white/10 ml-4 hidden sm:block"></div>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {categories?.map((cat) => {
              const cfg = getCatConfig(cat);
              const catSkills = skillsByCategory[cat] || [];
              return (
                <div
                  key={cat}
                  className="rounded-2xl border border-white/10 p-6 transition-colors duration-300"
                  style={{ background: cfg.bgColor }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = cfg.color + "66")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)")
                  }
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ background: cfg.color + "26" }}
                    >
                      {cfg.icon}
                    </div>
                    <h3 className="text-lg font-display font-bold text-white tracking-wide">
                      {cat}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.length > 0
                      ? catSkills.map((skill, idx) => (
                          <span
                            key={`skill-${skill.id ?? idx}`}
                            className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-default"
                            style={{
                              borderColor: cfg.borderColor,
                              color: cfg.textColor,
                              background: cfg.color + "0D",
                            }}
                          >
                            {skill.name}
                          </span>
                        ))
                      : !hasSkills &&
                        ["Loading..."].map((s) => (
                          <span
                            key={s}
                            className="px-3 py-1.5 rounded-full text-sm font-medium border border-white/10 text-white/30"
                          >
                            {s}
                          </span>
                        ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PROJECTS ─────────────────────────────────────────────────────── */}
      <section id="projects" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-16 flex items-center gap-4">
            <span className="text-primary text-2xl md:text-3xl font-normal">
              03.
            </span>
            Featured Work
            <div className="h-[1px] flex-grow bg-white/10 ml-4 hidden sm:block"></div>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0
              ? projects.map((p, i) => (
                  <ProjectCard
                    key={p.id ?? i}
                    title={p.title}
                    description={p.description}
                    tech={p.tags}
                    githubUrl={p.githubUrl || "#"}
                    liveUrl={p.liveUrl || undefined}
                    imageUrl={p.imageUrl}
                    delay={i * 100}
                  />
                ))
              : !loading && (
                  <p className="text-muted-foreground col-span-3 text-center py-10">
                    No projects yet. Add some from the admin dashboard!
                  </p>
                )}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ──────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-24 md:py-32 relative bg-card/50 border-t border-white/5"
      >
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div
            ref={contactRef as any}
            className={`text-center mb-16 animate-in-up ${contactInView ? "is-visible" : ""}`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-display text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Available for Freelance
            </div>

            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Although I'm currently looking for any new opportunities, my inbox
              is always open. Whether you have a question or just want to say
              hi, I'll try my best to get back to you!
            </p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-display text-muted-foreground uppercase tracking-wider"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    {...form.register("name")}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="John Doe"
                  />
                  {form.formState.errors.name && (
                    <p className="text-destructive text-xs mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-display text-muted-foreground uppercase tracking-wider"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="john@example.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-destructive text-xs mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-display text-muted-foreground uppercase tracking-wider"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...form.register("message")}
                  className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="Hello, I'd like to talk about..."
                />
                {form.formState.errors.message && (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-display font-bold tracking-wider uppercase rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Transmitting...</span>
                ) : (
                  <>
                    <Send
                      size={18}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />{" "}
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="py-8 text-center border-t border-white/5 bg-background relative z-10">
        <div className="flex justify-center gap-6 mb-6">
          <a
            href={about?.github || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href={about?.linkedin || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href={about?.twitter || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
          {about?.email && (
            <a
              href={`mailto:${about.email}`}
              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          )}
        </div>
        <p className="text-muted-foreground font-display text-sm">
          Designed & Built by {about?.name || "Alex Morgan"} <br />
          <span className="text-xs opacity-50 mt-2 block">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </p>
      </footer>
    </div>
  );
}
