const BASE = "/api/portfolio";

function getCredentials(): { username: string; password: string } | null {
  const saved = localStorage.getItem("admin_credentials");
  console.log("[API] localStorage admin_credentials:", saved);
  return saved ? JSON.parse(saved) : null;
}

function headers(): HeadersInit {
  const creds = getCredentials();
  console.log("[API] credentials:", creds);
  if (creds) {
    const h = {
      "Content-Type": "application/json",
      "x-username": creds.username,
      "x-password": creds.password,
    };
    console.log("[API] headers:", h);
    return h;
  }
  console.log("[API] no credentials, using basic headers");
  return {
    "Content-Type": "application/json",
  };
}

async function req<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  console.log(`[API] ${method} ${path}`, body);
  const h = headers();
  console.log("[API] final headers:", h);
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// Login
export const login = async (username: string, password: string) => {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }
  return data;
};

// Public
export const getPublicPortfolio = () =>
  req<{ about: any; skills: any[]; projects: any[] }>("GET", "/public");

// About
export const getAbout = () => req<any>("GET", "/about");
export const updateAbout = (data: any) => req<any>("PUT", "/about", data);

// Categories
export const getCategories = () => req<any[]>("GET", "/categories");
export const createCategory = (data: any) =>
  req<any>("POST", "/categories", data);
export const updateCategory = (id: string, data: any) =>
  req<any>("PUT", `/categories/${id}`, data);
export const deleteCategory = (id: string) =>
  req<any>("DELETE", `/categories/${id}`);

// Skills
export const getSkills = () => req<any[]>("GET", "/skills");
export const createSkill = (data: any) => req<any>("POST", "/skills", data);
export const updateSkill = (id: string, data: any) =>
  req<any>("PUT", `/skills/${id}`, data);
export const deleteSkill = (id: string) => req<any>("DELETE", `/skills/${id}`);

// Projects
export const getProjects = () => req<any[]>("GET", "/projects");
export const createProject = (data: any) => req<any>("POST", "/projects", data);
export const updateProject = (id: string, data: any) =>
  req<any>("PUT", `/projects/${id}`, data);
export const deleteProject = (id: string) =>
  req<any>("DELETE", `/projects/${id}`);
