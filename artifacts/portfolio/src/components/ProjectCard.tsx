"use client";

import { ExternalLink, Github } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  delay?: number;
}

export function ProjectCard({
  title,
  description,
  tech,
  githubUrl,
  liveUrl,
  imageUrl,
  delay = 0,
}: ProjectCardProps) {
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`
        animate-in-up ${isInView ? "is-visible" : ""}
        group relative flex flex-col justify-between h-full
        bg-card rounded-2xl p-6 md:p-8
        border border-white/5 
        transition-all duration-500 hover:-translate-y-2 box-glow-hover
        overflow-hidden
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Project Image */}
      {imageUrl && (
        <div className="mb-6 -mx-6 -mt-6 md:-mx-8 md:-mt-8 overflow-hidden rounded-t-2xl">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary group-hover:bg-primary/20 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="flex gap-3 text-muted-foreground">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
                aria-label="GitHub Repository"
              >
                <Github size={20} />
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
                aria-label="Live Demo"
              >
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 font-display group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {tech.map((item, i) => (
          <span
            key={i}
            className="text-xs font-medium font-display px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
