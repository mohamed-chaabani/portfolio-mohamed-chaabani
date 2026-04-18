import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await login(username, password);
    if (!ok) setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#060d14" }}
    >
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl border border-white/10 p-8"
          style={{ background: "#0a1628" }}
        >
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">⚡</div>
            <h1 className="text-2xl font-bold text-white">Portfolio Admin</h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              أدخل اسم المستخدم وكلمة المرور
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#9ca3af" }}
              >
                اسم المستخدم
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-lg border text-white placeholder-gray-600 outline-none transition-all focus:border-cyan-400"
                style={{
                  background: "#060d14",
                  borderColor: error ? "#ef4444" : "#1e3a5f",
                }}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#9ca3af" }}
              >
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-4 py-3 rounded-lg border text-white placeholder-gray-600 outline-none transition-all focus:border-cyan-400"
                style={{
                  background: "#060d14",
                  borderColor: error ? "#ef4444" : "#1e3a5f",
                }}
                required
              />
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50"
              style={{ background: "rgb(0,200,255)", color: "#060d14" }}
            >
              {loading ? "جاري التحقق..." : "دخول"}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: "#374151" }}>
            الافتراضي:{" "}
            <span className="font-mono text-cyan-600">admin / admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
