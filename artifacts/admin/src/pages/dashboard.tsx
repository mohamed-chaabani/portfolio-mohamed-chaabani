import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getPublicPortfolio } from "@/lib/api";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicPortfolio()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Skills",
      count: data?.skills?.length ?? 0,
      icon: "⚡",
      path: "/skills",
      color: "rgb(0,200,255)",
    },
    {
      label: "Projects",
      count: data?.projects?.length ?? 0,
      icon: "🚀",
      path: "/projects",
      color: "#8b5cf6",
    },
    {
      label: "Frontend Skills",
      count:
        data?.skills?.filter((s: any) => s.category === "Frontend").length ?? 0,
      icon: "🖥",
      path: "/skills",
      color: "#10b981",
    },
    {
      label: "Featured Projects",
      count: data?.projects?.filter((p: any) => p.featured).length ?? 0,
      icon: "⭐",
      path: "/projects",
      color: "#f59e0b",
    },
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1" style={{ color: "#6b7280" }}>
            مرحباً! هنا تتحكم في محتوى الـ Portfolio
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: "#6b7280" }}>
            جاري التحميل...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {cards.map((card) => (
                <Link key={card.label} href={card.path}>
                  <div
                    className="rounded-xl border p-5 cursor-pointer transition-all hover:border-current"
                    style={{ background: "#0a1628", borderColor: "#1e3a5f" }}
                  >
                    <div className="text-2xl mb-2">{card.icon}</div>
                    <div
                      className="text-3xl font-bold mb-1"
                      style={{ color: card.color }}
                    >
                      {card.count}
                    </div>
                    <div className="text-sm" style={{ color: "#9ca3af" }}>
                      {card.label}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="rounded-xl border p-6"
                style={{ background: "#0a1628", borderColor: "#1e3a5f" }}
              >
                <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span>👤</span> معلومات الـ Profile
                </h2>
                {data?.about ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#6b7280" }}>الاسم</span>
                      <span className="text-white">{data.about.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#6b7280" }}>المسمى الوظيفي</span>
                      <span className="text-white">{data.about.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#6b7280" }}>البريد</span>
                      <span className="text-white">
                        {data.about.email || "—"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    لا توجد بيانات بعد
                  </p>
                )}
                <Link href="/about">
                  <button
                    className="mt-4 text-sm font-medium px-4 py-2 rounded-lg transition-all"
                    style={{
                      color: "rgb(0,200,255)",
                      background: "rgba(0,200,255,0.1)",
                    }}
                  >
                    تعديل المعلومات ←
                  </button>
                </Link>
              </div>

              <div
                className="rounded-xl border p-6"
                style={{ background: "#0a1628", borderColor: "#1e3a5f" }}
              >
                <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span>🚀</span> آخر المشاريع
                </h2>
                {data?.projects?.slice(0, 3).map((p: any) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 py-2 border-b last:border-0"
                    style={{ borderColor: "#1e3a5f" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: p.featured ? "#f59e0b" : "#374151" }}
                    ></div>
                    <span className="text-sm text-white flex-1">{p.title}</span>
                    {p.featured && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(245,158,11,0.1)",
                          color: "#f59e0b",
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                ))}
                <Link href="/projects">
                  <button
                    className="mt-4 text-sm font-medium px-4 py-2 rounded-lg transition-all"
                    style={{
                      color: "#8b5cf6",
                      background: "rgba(139,92,246,0.1)",
                    }}
                  >
                    إدارة المشاريع ←
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
