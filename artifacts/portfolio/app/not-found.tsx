"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-8xl font-black font-display text-primary">404</h1>
      <p className="text-2xl text-muted-foreground mt-4 mb-8">Page Not Found</p>
      <Link
        href="/"
        className="px-8 py-4 bg-primary text-primary-foreground font-display font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all"
      >
        Go Home
      </Link>
    </div>
  );
}
