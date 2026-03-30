import { useEffect, useState } from "react";
import { getSkills, createSkill, updateSkill, deleteSkill } from "@/lib/api";
import Layout from "@/components/Layout";

const CATEGORIES = ["Frontend", "Backend", "DevOps & Tools"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ name: "", category: "Frontend" });
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const load = () => getSkills().then(setSkills).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newSkill.name.trim()) return;
    setAdding(true);
    await createSkill({ ...newSkill, order: skills.length + 1 });
    setNewSkill({ name: "", category: "Frontend" });
    await load();
    setAdding(false);
  };

  const handleDelete = async (id: number) => {
    await deleteSkill(id);
    setSkills((s) => s.filter((sk) => sk.id !== id));
  };

  const handleEdit = async (id: number) => {
    await updateSkill(id, editData);
    setEditId(null);
    await load();
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, any[]>);

  const catColors: Record<string, string> = {
    "Frontend": "rgb(0,200,255)",
    "Backend": "#8b5cf6",
    "DevOps & Tools": "#10b981",
  };

  return (
    <Layout>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Skills</h1>
          <p className="mt-1" style={{ color: '#6b7280' }}>إدارة مهاراتك التقنية</p>
        </div>

        {/* Add Skill */}
        <div className="rounded-xl border p-5 mb-6" style={{ background: '#0a1628', borderColor: '#1e3a5f' }}>
          <h2 className="font-bold text-white mb-4">إضافة مهارة جديدة</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill((n) => ({ ...n, name: e.target.value }))}
              placeholder="اسم المهارة"
              className="flex-1 px-4 py-2.5 rounded-lg border text-white text-sm outline-none focus:border-cyan-400"
              style={{ background: '#060d14', borderColor: '#1e3a5f' }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill((n) => ({ ...n, category: e.target.value }))}
              className="px-4 py-2.5 rounded-lg border text-white text-sm outline-none"
              style={{ background: '#060d14', borderColor: '#1e3a5f' }}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={handleAdd}
              disabled={adding}
              className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
              style={{ background: 'rgb(0,200,255)', color: '#060d14' }}
            >
              {adding ? "..." : "+ إضافة"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10" style={{ color: '#6b7280' }}>جاري التحميل...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <div key={cat} className="rounded-xl border p-5" style={{ background: '#0a1628', borderColor: '#1e3a5f' }}>
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: catColors[cat] }}>{cat}</h3>
                <div className="space-y-2">
                  {grouped[cat]?.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2 group">
                      {editId === skill.id ? (
                        <>
                          <input
                            value={editData.name}
                            onChange={(e) => setEditData((d: any) => ({ ...d, name: e.target.value }))}
                            className="flex-1 px-3 py-1.5 rounded-lg border text-white text-sm outline-none"
                            style={{ background: '#060d14', borderColor: '#1e3a5f' }}
                            onKeyDown={(e) => e.key === "Enter" && handleEdit(skill.id)}
                            autoFocus
                          />
                          <button onClick={() => handleEdit(skill.id)} className="text-xs px-2 py-1 rounded" style={{ color: '#10b981' }}>✓</button>
                          <button onClick={() => setEditId(null)} className="text-xs px-2 py-1 rounded" style={{ color: '#6b7280' }}>✕</button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm text-white px-3 py-1.5 rounded-lg" style={{ background: '#060d14' }}>{skill.name}</span>
                          <button
                            onClick={() => { setEditId(skill.id); setEditData({ name: skill.name, category: skill.category }); }}
                            className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded transition-all"
                            style={{ color: '#9ca3af' }}
                          >✏️</button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded transition-all"
                            style={{ color: '#ef4444' }}
                          >🗑</button>
                        </>
                      )}
                    </div>
                  ))}
                  {grouped[cat]?.length === 0 && (
                    <p className="text-xs" style={{ color: '#374151' }}>لا توجد مهارات بعد</p>
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
