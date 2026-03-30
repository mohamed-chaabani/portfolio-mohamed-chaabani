const BASE = "/api/portfolio";

function getSecret(): string {
  return localStorage.getItem("admin_secret") || "";
}

function headers(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-admin-secret": getSecret(),
  };
}

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// Public
export const getPublicPortfolio = () =>
  req<{ about: any; skills: any[]; projects: any[] }>("GET", "/public");

// About
export const getAbout = () => req<any>("GET", "/about");
export const updateAbout = (data: any) => req<any>("PUT", "/about", data);

// Skills
export const getSkills = () => req<any[]>("GET", "/skills");
export const createSkill = (data: any) => req<any>("POST", "/skills", data);
export const updateSkill = (id: number, data: any) => req<any>("PUT", `/skills/${id}`, data);
export const deleteSkill = (id: number) => req<any>("DELETE", `/skills/${id}`);

// Projects
export const getProjects = () => req<any[]>("GET", "/projects");
export const createProject = (data: any) => req<any>("POST", "/projects", data);
export const updateProject = (id: number, data: any) => req<any>("PUT", `/projects/${id}`, data);
export const deleteProject = (id: number) => req<any>("DELETE", `/projects/${id}`);
