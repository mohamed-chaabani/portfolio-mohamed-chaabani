import { Category } from "@workspace/db";

export const getCategories = async (req: any, res: any) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const createCategory = async (req: any, res: any) => {
  try {
    const created = await Category.create(req.body);
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategory = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    await Category.findByIdAndDelete(id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
