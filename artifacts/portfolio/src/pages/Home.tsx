"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Github, Linkedin, Twitter, Mail, ArrowRight, Send, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInView } from '@/hooks/use-in-view';

import { CanvasParticles } from '@/components/CanvasParticles';
import { TypingEffect } from '@/components/TypingEffect';
import { Navbar } from '@/components/Navbar';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { SkillBar } from '@/components/SkillBar';
import { ProjectCard } from '@/components/ProjectCard';

// Setup Form Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Home() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [aboutRef, aboutInView] = useInView({ threshold: 0.2 });
  const [contactRef, contactInView] = useInView({ threshold: 0.2 });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
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
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <CanvasParticles />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start mt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-display text-sm font-medium mb-6 animate-in-up is-visible">
            <Terminal size={16} />
            <span>System Ready _</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display text-white tracking-tighter mb-4 animate-in-up is-visible delay-100">
            Alex <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Morgan</span>
          </h1>
          
          <div className="text-xl md:text-3xl lg:text-4xl text-muted-foreground font-medium mb-8 animate-in-up is-visible delay-200 h-[40px] md:h-[56px]">
            <span className="mr-3">I build</span>
            <TypingEffect words={[
              "scalable web apps.",
              "high-performance APIs.",
              "beautiful user interfaces.",
              "secure cloud architectures."
            ]} />
          </div>
          
          <p className="max-w-xl text-lg text-muted-foreground/80 leading-relaxed mb-10 animate-in-up is-visible delay-300">
            A full-stack engineer specializing in building (and occasionally designing) exceptional digital experiences. Currently focused on building accessible, human-centered products.
          </p>
          
          <div className="flex flex-wrap gap-4 animate-in-up is-visible delay-400">
            <button 
              onClick={() => scrollTo('#projects')}
              className="px-8 py-4 bg-primary text-primary-foreground font-display font-bold tracking-wider uppercase rounded-lg hover:bg-primary/90 transition-all box-glow flex items-center gap-2 group"
            >
              View Work
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollTo('#contact')}
              className="px-8 py-4 bg-transparent text-white font-display font-bold tracking-wider uppercase rounded-lg border-2 border-white/20 hover:border-white/60 hover:bg-white/5 transition-all"
            >
              Contact Me
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float opacity-70">
          <span className="text-xs font-display uppercase tracking-widest text-muted-foreground">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              ref={aboutRef as any}
              className={`animate-in-up ${aboutInView ? 'is-visible' : ''}`}
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 flex items-center gap-4">
                <span className="text-primary text-2xl md:text-3xl font-normal">01.</span> 
                About Me
                <div className="h-[1px] flex-grow bg-white/10 ml-4 hidden sm:block"></div>
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Hello! My name is Alex and I enjoy creating things that live on the internet. My interest in web development started back in 2015 when I decided to try editing custom Tumblr themes — turns out hacking together HTML & CSS taught me a lot about logic and structure!
                </p>
                <p>
                  Fast-forward to today, and I've had the privilege of working at an advertising agency, a start-up, a huge corporation, and a student-led design studio. My main focus these days is building accessible, inclusive products and digital experiences for a variety of clients.
                </p>
                <p>
                  When I'm not at the computer, I'm usually hanging out with my dog, reading sci-fi novels, or experimenting with generative art.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <AnimatedCounter end={50} suffix="+" label="Projects" />
              <AnimatedCounter end={5} suffix="+" label="Years Exp" duration={1500} />
              <AnimatedCounter end={30} suffix="+" label="Clients" duration={2500} />
              <AnimatedCounter end={10} suffix="+" label="Tech Stack" duration={2000} />
            </div>
          </div>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skills" className="py-24 md:py-32 bg-card/30 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-16 flex items-center gap-4">
            <span className="text-primary text-2xl md:text-3xl font-normal">02.</span> 
            Technical Arsenal
            <div className="h-[1px] flex-grow bg-white/10 ml-4 hidden sm:block"></div>
          </h2>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            <div>
              <h3 className="text-xl font-display font-semibold text-white mb-8 border-b border-white/10 pb-4 inline-block pr-10">Frontend</h3>
              <SkillBar name="React / Next.js" percentage={95} delay={100} />
              <SkillBar name="TypeScript" percentage={90} delay={200} />
              <SkillBar name="Tailwind CSS" percentage={95} delay={300} />
              <SkillBar name="Three.js / Canvas" percentage={75} delay={400} />
            </div>
            
            <div>
              <h3 className="text-xl font-display font-semibold text-white mb-8 border-b border-white/10 pb-4 inline-block pr-10">Backend</h3>
              <SkillBar name="Node.js / Express" percentage={90} delay={150} />
              <SkillBar name="Python / Django" percentage={80} delay={250} />
              <SkillBar name="PostgreSQL" percentage={85} delay={350} />
              <SkillBar name="Redis" percentage={70} delay={450} />
            </div>

            <div>
              <h3 className="text-xl font-display font-semibold text-white mb-8 border-b border-white/10 pb-4 inline-block pr-10">DevOps & Tools</h3>
              <SkillBar name="Docker" percentage={80} delay={200} />
              <SkillBar name="AWS / GCP" percentage={75} delay={300} />
              <SkillBar name="CI/CD (Actions)" percentage={85} delay={400} />
              <SkillBar name="Figma" percentage={90} delay={500} />
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-16 flex items-center gap-4">
            <span className="text-primary text-2xl md:text-3xl font-normal">03.</span> 
            Featured Work
            <div className="h-[1px] flex-grow bg-white/10 ml-4 hidden sm:block"></div>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard 
              title="Nexus E-Commerce"
              description="A high-performance headless e-commerce platform with real-time inventory tracking, Stripe payments, and an AI-driven product recommendation engine."
              tech={["Next.js", "TypeScript", "Stripe", "Prisma"]}
              githubUrl="#"
              liveUrl="#"
              delay={0}
            />
            <ProjectCard 
              title="Sync Task Manager"
              description="Collaborative project management tool featuring real-time socket connections for live board updates, drag-and-drop interfaces, and role-based access control."
              tech={["React", "Node.js", "Socket.io", "PostgreSQL"]}
              githubUrl="#"
              liveUrl="#"
              delay={100}
            />
            <ProjectCard 
              title="Aura Chat"
              description="End-to-end encrypted messaging application supporting voice notes, media sharing, and self-destructing messages within specialized team channels."
              tech={["React Native", "WebRTC", "Express", "MongoDB"]}
              githubUrl="#"
              delay={200}
            />
            <ProjectCard 
              title="Quantum Portfolio CMS"
              description="A brutalist, developer-focused content management system for portfolios. Markdown support, API generation, and automated GitHub Pages deployment."
              tech={["Vue.js", "Go", "Docker", "GraphQL"]}
              githubUrl="#"
              liveUrl="#"
              delay={300}
            />
            <ProjectCard 
              title="Atmos Weather Dashboard"
              description="Global climate monitoring dashboard aggregating data from 5+ meteorological APIs. Features WebGL interactive globe and predictive forecasting models."
              tech={["Three.js", "React", "Python", "FastAPI"]}
              githubUrl="#"
              liveUrl="#"
              delay={400}
            />
            <ProjectCard 
              title="Echo Social API"
              description="Robust, rate-limited RESTful API serving as the backbone for a niche social network. Includes comprehensive Swagger documentation and OAuth 2.0."
              tech={["Express", "Redis", "Jest", "Swagger"]}
              githubUrl="#"
              delay={500}
            />
          </div>
          
          <div className="mt-16 text-center">
            <a href="#" className="inline-flex items-center gap-2 text-primary font-display font-semibold hover:text-white transition-colors group">
              View Archive 
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-24 md:py-32 relative bg-card/50 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div 
            ref={contactRef as any}
            className={`text-center mb-16 animate-in-up ${contactInView ? 'is-visible' : ''}`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-display text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Available for Freelance
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Although I'm currently looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-display text-muted-foreground uppercase tracking-wider">Name</label>
                  <input
                    id="name"
                    {...form.register("name")}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="John Doe"
                  />
                  {form.formState.errors.name && (
                    <p className="text-destructive text-xs mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-display text-muted-foreground uppercase tracking-wider">Email</label>
                  <input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="john@example.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-destructive text-xs mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-display text-muted-foreground uppercase tracking-wider">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  {...form.register("message")}
                  className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="Hello, I'd like to talk about..."
                />
                {form.formState.errors.message && (
                  <p className="text-destructive text-xs mt-1">{form.formState.errors.message.message}</p>
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
                    Send Message
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 text-center border-t border-white/5 bg-background relative z-10">
        <div className="flex justify-center gap-6 mb-6">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full" aria-label="GitHub">
            <Github size={20} />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full" aria-label="LinkedIn">
            <Linkedin size={20} />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full" aria-label="Twitter">
            <Twitter size={20} />
          </a>
          <a href="mailto:hello@example.com" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full" aria-label="Email">
            <Mail size={20} />
          </a>
        </div>
        <p className="text-muted-foreground font-display text-sm">
          Designed & Built by Alex Morgan <br/>
          <span className="text-xs opacity-50 mt-2 block">© {new Date().getFullYear()} All rights reserved.</span>
        </p>
      </footer>
    </div>
  );
}
