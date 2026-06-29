import { Project } from "@workspace/db";

// Get all projects
export const getProjects = async (req: any, res: any) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// Create new project
export const createProject = async (req: any, res: any) => {
  try {
    const { title, description, longDescription, tags, githubUrl, liveUrl, imageUrl, featured, order } = req.body;
    
    const created = await Project.create({
      title,
      description,
      longDescription,
      tags,
      githubUrl,
      liveUrl,
      imageUrl, // Cloudinary URL from upload
      featured,
      order,
    });
    
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Failed to create project" });
  }
};

// Update project
export const updateProject = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const { title, description, longDescription, tags, githubUrl, liveUrl, imageUrl, featured, order } = req.body;
    
    const updated = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description,
        longDescription,
        tags,
        githubUrl,
        liveUrl,
        imageUrl, // Can be updated with new Cloudinary URL
        featured,
        order,
      },
      { new: true }
    );
    
    if (!updated) return res.status(404).json({ error: "Project not found" });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update project" });
  }
};

// Delete project
export const deleteProject = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    await Project.findByIdAndDelete(id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete project" });
  }
};
