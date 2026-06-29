import { useEffect, useState } from "react";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";
import Layout from "@/components/Layout";

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ name: "", category: "" });
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#8b5cf6");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryData, setEditingCategoryData] = useState<any>({});
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const loadSkills = () => getSkills().then(setSkills);
  const loadCategories = () =>
    getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0 && !newSkill.category) {
        setNewSkill((n: any) => ({ ...n, category: cats[0].name }));
      }
    });

  const load = () => {
    setLoading(true);
    Promise.all([loadSkills(), loadCategories()]).finally(() =>
      setLoading(false),
    );
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!newSkill.name.trim()) return;
    setAdding(true);
    await createSkill({ ...newSkill, order: skills.length + 1 });
    setNewSkill({ name: "", category: categories[0]?.name || "" });
    await load();
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteSkill(id);
    setSkills((s) => s.filter((sk) => sk._id !== id));
  };

  const handleEdit = async (id: string) => {
    await updateSkill(id, editData);
    setEditId(null);
    await load();
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setAddingCategory(true);
    await createCategory({
      name: newCategory,
      order: categories.length + 1,
      color: selectedColor,
    });
    setNewCategory("");
    setSelectedColor(COLORS[0].value);
    await loadCategories();
    setAddingCategory(false);
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    await loadCategories();
  };

  const handleEditCategory = (cat: any) => {
    setIsEditingCategory(true);
    setNewCategory(cat.name);
    setSelectedColor(cat.color || COLORS[0].value);
    setEditingCategoryId(cat._id);
  };

  const handleUpdateCategory = async () => {
    if (!newCategory.trim() || !editingCategoryId) return;
    setAddingCategory(true);
    await updateCategory(editingCategoryId, {
      name: newCategory,
      color: selectedColor,
    });
    setNewCategory("");
    setSelectedColor(COLORS[0].value);
    setIsEditingCategory(false);
    setEditingCategoryId(null);
    await loadCategories();
    setAddingCategory(false);
  };

  const handleCancelEdit = () => {
    setIsEditingCategory(false);
    setNewCategory("");
    setSelectedColor(COLORS[0].value);
    setEditingCategoryId(null);
  };

  const grouped = categories.reduce((acc: Record<string, any[]>, cat: any) => {
    acc[cat.name] = skills.filter((s) => s.category === cat.name);
    return acc;
  }, {});

  const COLORS = [
    { name: "Cyan", value: "#00c8ff" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Green", value: "#10b981" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
    { name: "Red", value: "#ef4444" },
    { name: "Yellow", value: "#eab308" },
  ];

  const catColors: Record<string, string> = {
    Frontend: "#00c8ff",
    Backend: "#8b5cf6",
    "DevOps & Tools": "#10b981",
  };

  return (
    <Layout>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Skills</h1>
          <p className="mt-1" style={{ color: "#6b7280" }}>
            إدارة مهاراتك التقنية
          </p>
        </div>

        {/* Add/Edit Category */}
        <div
          className="rounded-xl border p-5 mb-6"
          style={{ background: "#0a1628", borderColor: "#1e3a5f" }}
        >
          <h2 className="font-bold text-white mb-4">
            {isEditingCategory ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="اسم التصنيف"
              className="flex-1 px-4 py-2.5 rounded-lg border text-white text-sm outline-none focus:border-cyan-400"
              style={{ background: "#060d14", borderColor: "#1e3a5f" }}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (isEditingCategory
                  ? handleUpdateCategory()
                  : handleAddCategory())
              }
            />
            {isEditingCategory ? (
              <>
                <button
                  onClick={handleUpdateCategory}
                  disabled={addingCategory}
                  className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
                  style={{ background: "#10b981", color: "#060d14" }}
                >
                  {addingCategory ? "..." : "تحديث"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all"
                  style={{ background: "#6b7280", color: "#060d14" }}
                >
                  إلغاء
                </button>
              </>
            ) : (
              <button
                onClick={handleAddCategory}
                disabled={addingCategory}
                className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
                style={{ background: "#8b5cf6", color: "#060d14" }}
              >
                {addingCategory ? "..." : "+ إضافة"}
              </button>
            )}
          </div>

          {/* Color Picker */}
          <div className="mt-4">
            <label className="text-sm text-gray-400 mb-2 block">
              اختر اللون
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    selectedColor === color.value
                      ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900"
                      : ""
                  }`}
                  style={{ background: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Add Skill */}
        <div
          className="rounded-xl border p-5 mb-6"
          style={{ background: "#0a1628", borderColor: "#1e3a5f" }}
        >
          <h2 className="font-bold text-white mb-4">إضافة مهارة جديدة</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill((n) => ({ ...n, name: e.target.value }))
              }
              placeholder="اسم المهارة"
              className="flex-1 px-4 py-2.5 rounded-lg border text-white text-sm outline-none focus:border-cyan-400"
              style={{ background: "#060d14", borderColor: "#1e3a5f" }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <select
              value={newSkill.category}
              onChange={(e) =>
                setNewSkill((n) => ({ ...n, category: e.target.value }))
              }
              className="px-4 py-2.5 rounded-lg border text-white text-sm outline-none"
              style={{ background: "#060d14", borderColor: "#1e3a5f" }}
            >
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              disabled={adding}
              className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
              style={{ background: "rgb(0,200,255)", color: "#060d14" }}
            >
              {adding ? "..." : "+ إضافة"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10" style={{ color: "#6b7280" }}>
            جاري التحميل...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="rounded-xl border p-5 group"
                style={{ background: "#0a1628", borderColor: "#1e3a5f" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <>
                    <h3
                      className="font-bold text-sm uppercase tracking-wider"
                      style={{
                        color: cat.color || catColors[cat.name],
                      }}
                    >
                      {cat.name}
                    </h3>
                    {isEditingCategory && editingCategoryId === cat._id ? (
                      <></>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded transition-all"
                          style={{ color: "#9ca3af" }}
                          title="تعديل"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded transition-all"
                          style={{ color: "#ef4444" }}
                          title="حذف"
                        >
                          🗑
                        </button>
                      </div>
                    )}
                  </>
                </div>
                <div className="space-y-2">
                  {grouped[cat.name]?.map((skill: any) => (
                    <div
                      key={skill._id}
                      className="flex items-center gap-2 group"
                    >
                      {editId === skill._id ? (
                        <>
                          <input
                            value={editData.name}
                            onChange={(e) =>
                              setEditData((d: any) => ({
                                ...d,
                                name: e.target.value,
                              }))
                            }
                            className="flex-1 px-3 py-1.5 rounded-lg border text-white text-sm outline-none"
                            style={{
                              background: "#060d14",
                              borderColor: "#1e3a5f",
                            }}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleEdit(skill._id)
                            }
                            autoFocus
                          />
                          <button
                            onClick={() => handleEdit(skill._id)}
                            className="text-xs px-2 py-1 rounded"
                            style={{ color: "#10b981" }}
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="text-xs px-2 py-1 rounded"
                            style={{ color: "#6b7280" }}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <span
                            className="flex-1 text-sm text-white px-3 py-1.5 rounded-lg"
                            style={{ background: "#060d14" }}
                          >
                            {skill.name}
                          </span>
                          <button
                            onClick={() => {
                              setEditId(skill._id);
                              setEditData({
                                name: skill.name,
                                category: skill.category,
                              });
                            }}
                            className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded transition-all"
                            style={{ color: "#9ca3af" }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id)}
                            className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded transition-all"
                            style={{ color: "#ef4444" }}
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  {grouped[cat.name]?.length === 0 && (
                    <p className="text-xs" style={{ color: "#374151" }}>
                      لا توجد مهارات بعد
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
