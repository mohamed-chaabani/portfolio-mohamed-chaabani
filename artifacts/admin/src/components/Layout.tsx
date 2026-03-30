import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

const navItems = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/about", label: "About & Info", icon: "👤" },
  { path: "/skills", label: "Skills", icon: "⚡" },
  { path: "/projects", label: "Projects", icon: "🚀" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex" style={{ background: '#060d14' }}>
      {/* Sidebar */}
      <aside className="w-64 border-r flex flex-col" style={{ background: '#0a1628', borderColor: '#1e3a5f' }}>
        <div className="p-6 border-b" style={{ borderColor: '#1e3a5f' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'rgb(0,200,255)', color: '#060d14' }}>A</div>
            <div>
              <p className="font-bold text-white text-sm">Portfolio Admin</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>Content Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm font-medium"
                  style={{
                    background: isActive ? 'rgba(0,200,255,0.1)' : 'transparent',
                    color: isActive ? 'rgb(0,200,255)' : '#9ca3af',
                    borderLeft: isActive ? '2px solid rgb(0,200,255)' : '2px solid transparent',
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: '#1e3a5f' }}>
          <button
            onClick={logout}
            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left flex items-center gap-2"
            style={{ color: '#ef4444' }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
