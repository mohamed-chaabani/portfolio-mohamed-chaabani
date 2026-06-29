import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
} from "@/lib/api";
import Layout from "@/components/Layout";

const EMPTY = {
  title: "",
  description: "",
  longDescription: "",
  tags: [] as string[],
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
  featured: false,
  order: 0,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<any | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const load = () =>
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm({ ...EMPTY });
    setTagsInput("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditProject(null);
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setForm({ ...p });
    setTagsInput(p.tags?.join(", ") || "");
    setSelectedFile(null);
    setPreviewUrl(p.imageUrl || null);
    setEditProject(p);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);

    // Upload image first if selected
    let imageUrl = form.imageUrl;
    if (selectedFile) {
      const uploadedUrl = await handleUploadImage();
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        setSaving(false);
        return; // Stop if upload failed
      }
    }

    const data = {
      ...form,
      imageUrl,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editProject) {
      await updateProject(editProject._id, data);
    } else {
      await createProject({ ...data, order: projects.length + 1 });
    }

    // Clean up preview URL
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    await load();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا المشروع؟")) return;
    await deleteProject(id);
    setProjects((p) => p.filter((proj) => proj._id !== id));
  };

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return form.imageUrl || null;

    setUploading(true);
    try {
      const result = await uploadProjectImage(selectedFile);
      set("imageUrl", result.url);
      setUploading(false);
      return result.url;
    } catch (err) {
      setUploading(false);
      alert("فشل رفع الصورة: " + (err as Error).message);
      return null;
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="mt-1" style={{ color: "#6b7280" }}>
              إدارة مشاريعك
            </p>
          </div>
          <button
            onClick={openAdd}
            className="px-5 py-2.5 rounded-lg font-bold text-sm"
            style={{ background: "rgb(0,200,255)", color: "#060d14" }}
          >
            + مشروع جديد
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)" }}
          >
            <div
              className="rounded-2xl border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
              style={{ background: "#0a1628", borderColor: "#1e3a5f" }}
            >
              <h2 className="font-bold text-white text-xl mb-6">
                {editProject ? "تعديل المشروع" : "إضافة مشروع جديد"}
              </h2>

              <div className="space-y-4">
                <Field
                  label="اسم المشروع *"
                  value={form.title}
                  onChange={(v) => set("title", v)}
                  placeholder="DevFlow"
                />
                <Field
                  label="وصف قصير *"
                  value={form.description}
                  onChange={(v) => set("description", v)}
                  placeholder="وصف قصير للمشروع"
                />
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#9ca3af" }}
                  >
                    وصف تفصيلي
                  </label>
                  <textarea
                    value={form.longDescription}
                    onChange={(e) => set("longDescription", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border text-white text-sm outline-none resize-none"
                    style={{ background: "#060d14", borderColor: "#1e3a5f" }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#9ca3af" }}
                  >
                    Tags (مفصولة بفاصلة)
                  </label>
                  <input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="React, Node.js, PostgreSQL"
                    className="w-full px-4 py-2.5 rounded-lg border text-white text-sm outline-none"
                    style={{ background: "#060d14", borderColor: "#1e3a5f" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="GitHub URL"
                    value={form.githubUrl}
                    onChange={(v) => set("githubUrl", v)}
                    placeholder="https://github.com/..."
                  />
                  <Field
                    label="Live URL"
                    value={form.liveUrl}
                    onChange={(v) => set("liveUrl", v)}
                    placeholder="https://..."
                  />
                </div>
                {/* Image Upload */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#9ca3af" }}
                  >
                    صورة المشروع
                  </label>

                  {/* Image Preview */}
                  {previewUrl && (
                    <div
                      className="mb-3 rounded-lg border overflow-hidden"
                      style={{ borderColor: "#1e3a5f", background: "#060d14" }}
                    >
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-auto max-h-[300px] object-contain"
                      />
                    </div>
                  )}

                  {/* File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2.5 rounded-lg border text-white text-sm"
                    style={{ background: "#060d14", borderColor: "#1e3a5f" }}
                  />
                  {uploading && (
                    <p
                      className="text-sm mt-2"
                      style={{ color: "rgb(0,200,255)" }}
                    >
                      جاري رفع الصورة...
                    </p>
                  )}
                  {form.imageUrl && !previewUrl?.startsWith("blob:") && (
                    <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
                      الصورة الحالية: {form.imageUrl.split("/").pop()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => set("featured", e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm"
                    style={{ color: "#9ca3af" }}
                  >
                    مشروع مميز (Featured)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-lg font-bold text-sm disabled:opacity-50"
                  style={{ background: "rgb(0,200,255)", color: "#060d14" }}
                >
                  {saving
                    ? "جاري الحفظ..."
                    : editProject
                      ? "حفظ التعديلات"
                      : "إضافة المشروع"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm border"
                  style={{ borderColor: "#1e3a5f", color: "#9ca3af" }}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10" style={{ color: "#6b7280" }}>
            جاري التحميل...
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => (
              <div
                key={p._id}
                className="rounded-xl border p-5 flex items-start gap-4"
                style={{ background: "#0a1628", borderColor: "#1e3a5f" }}
              >
                {/* Project Image */}
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-24 h-24 rounded-lg object-cover border flex-shrink-0"
                    style={{ borderColor: "#1e3a5f" }}
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{p.title}</h3>
                    {p.featured && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(245,158,11,0.1)",
                          color: "#f59e0b",
                        }}
                      >
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-2" style={{ color: "#9ca3af" }}>
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: "rgba(0,200,255,0.3)",
                          color: "rgb(0,200,255)",
                          background: "rgba(0,200,255,0.05)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                    style={{ borderColor: "#1e3a5f", color: "#9ca3af" }}
                  >
                    ✏️ تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                    style={{
                      borderColor: "rgba(239,68,68,0.3)",
                      color: "#ef4444",
                    }}
                  >
                    🗑 حذف
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div
                className="text-center py-10 rounded-xl border"
                style={{
                  background: "#0a1628",
                  borderColor: "#1e3a5f",
                  color: "#6b7280",
                }}
              >
                لا توجد مشاريع بعد. اضغط "+ مشروع جديد" للبدء
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function Field({ label, value, onChange, placeholder }: any) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: "#9ca3af" }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border text-white text-sm outline-none"
        style={{ background: "#060d14", borderColor: "#1e3a5f" }}
      />
    </div>
  );
}
