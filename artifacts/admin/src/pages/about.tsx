import { useEffect, useState } from "react";
import { getAbout, updateAbout } from "@/lib/api";
import Layout from "@/components/Layout";

export default function AboutPage() {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPhrase, setNewPhrase] = useState("");

  useEffect(() => {
    getAbout().then((data) => {
      setForm({ ...data, phrases: data?.phrases || [] });
      setLoading(false);
    });
  }, []);

  const set = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

  const addPhrase = () => {
    if (!newPhrase.trim()) return;
    set("phrases", [...(form.phrases || []), newPhrase.trim()]);
    setNewPhrase("");
  };

  const removePhrase = (index: number) => {
    set("phrases", form.phrases.filter((_: any, i: number) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateAbout(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <Layout><div className="p-8 text-center" style={{ color: '#6b7280' }}>جاري التحميل...</div></Layout>;

  return (
    <Layout>
      <div className="p-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">About & Info</h1>
            <p className="mt-1" style={{ color: '#6b7280' }}>معلوماتك الشخصية والتواصل</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
            style={{ background: saved ? '#10b981' : 'rgb(0,200,255)', color: '#060d14' }}
          >
            {saving ? "جاري الحفظ..." : saved ? "✓ تم الحفظ" : "حفظ التغييرات"}
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-xl border p-6" style={{ background: '#0a1628', borderColor: '#1e3a5f' }}>
            <h2 className="font-bold text-white mb-4">المعلومات الأساسية</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="الاسم الكامل" value={form.name || ""} onChange={(v) => set("name", v)} placeholder="Alex Morgan" />
              <Field label="المسمى الوظيفي" value={form.title || ""} onChange={(v) => set("title", v)} placeholder="Full Stack Developer" />
            </div>

            {/* Phrases Array */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1" style={{ color: '#9ca3af' }}>
                جمل الـ Typing Effect
              </label>
              <p className="text-xs mb-3" style={{ color: '#4b5563' }}>
                هذه الجمل تتناوب في الموقع — "I build <span className="text-cyan-500">...</span>"
              </p>

              {/* Existing phrases */}
              <div className="space-y-2 mb-3">
                {(form.phrases || []).map((phrase: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm" style={{ background: '#060d14', borderColor: '#1e3a5f' }}>
                      <span className="text-gray-500 font-mono text-xs">I build</span>
                      <span className="text-cyan-400 font-semibold">{phrase}</span>
                    </div>
                    <button
                      onClick={() => removePhrase(i)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border transition-all hover:border-red-500/50 flex-shrink-0"
                      style={{ borderColor: '#1e3a5f', color: '#ef4444' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {(form.phrases || []).length === 0 && (
                  <p className="text-xs py-2" style={{ color: '#4b5563' }}>لا توجد جمل بعد</p>
                )}
              </div>

              {/* Add new phrase */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: '#060d14', borderColor: '#1e3a5f' }}>
                  <span className="text-gray-500 font-mono text-xs flex-shrink-0">I build</span>
                  <input
                    type="text"
                    value={newPhrase}
                    onChange={(e) => setNewPhrase(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addPhrase()}
                    placeholder="scalable web experiences"
                    className="flex-1 bg-transparent text-white text-sm outline-none"
                  />
                </div>
                <button
                  onClick={addPhrase}
                  className="px-4 py-2 rounded-lg font-bold text-sm flex-shrink-0"
                  style={{ background: 'rgba(0,200,255,0.15)', color: 'rgb(0,200,255)', border: '1px solid rgba(0,200,255,0.3)' }}
                >
                  + إضافة
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>نبذة تعريفية (Bio)</label>
              <textarea
                value={form.bio || ""}
                onChange={(e) => set("bio", e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border text-white text-sm outline-none transition-all focus:border-cyan-400 resize-none"
                style={{ background: '#060d14', borderColor: '#1e3a5f' }}
                placeholder="اكتب نبذة عنك..."
              />
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl border p-6" style={{ background: '#0a1628', borderColor: '#1e3a5f' }}>
            <h2 className="font-bold text-white mb-4">معلومات التواصل</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="البريد الإلكتروني" value={form.email || ""} onChange={(v) => set("email", v)} placeholder="you@example.com" />
              <Field label="GitHub" value={form.github || ""} onChange={(v) => set("github", v)} placeholder="https://github.com/username" />
              <Field label="LinkedIn" value={form.linkedin || ""} onChange={(v) => set("linkedin", v)} placeholder="https://linkedin.com/in/username" />
              <Field label="Twitter" value={form.twitter || ""} onChange={(v) => set("twitter", v)} placeholder="https://twitter.com/username" />
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-xl border p-6" style={{ background: '#0a1628', borderColor: '#1e3a5f' }}>
            <h2 className="font-bold text-white mb-4">الإحصائيات</h2>
            <div className="grid grid-cols-3 gap-4">
              <NumberField label="سنوات الخبرة" value={form.yearsExperience ?? 0} onChange={(v) => set("yearsExperience", v)} />
              <NumberField label="المشاريع المكتملة" value={form.projectsCompleted ?? 0} onChange={(v) => set("projectsCompleted", v)} />
              <NumberField label="العملاء السعداء" value={form.happyClients ?? 0} onChange={(v) => set("happyClients", v)} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, value, onChange, placeholder, className = "" }: any) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border text-white text-sm outline-none transition-all focus:border-cyan-400"
        style={{ background: '#060d14', borderColor: '#1e3a5f' }}
      />
    </div>
  );
}

function NumberField({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-2.5 rounded-lg border text-white text-sm outline-none transition-all focus:border-cyan-400"
        style={{ background: '#060d14', borderColor: '#1e3a5f' }}
      />
    </div>
  );
}
