import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Link2, 
  Menu, 
  X, 
  ChevronRight,
  User
} from "lucide-react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Create Link", href: "/create", icon: PlusCircle },
  ];

  const currentNav = navigation.find((item) => item.href === location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card border-r border-border p-6 transition-transform duration-300">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-2 font-semibold text-lg" onClick={() => setSidebarOpen(false)}>
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                  T
                </div>
                <span>Trim</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1.5 flex-1">
              {navigation.map((item) => {
                const active = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border pt-4 mt-auto">
              <div className="flex items-center gap-3 px-2">
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground border border-border">
                  <User size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Trim User</p>
                  <p className="text-xs text-muted-foreground truncate">user@trim.so</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-card">
        <div className="flex flex-col flex-1 min-h-0 p-6">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              T
            </div>
            <span className="font-semibold text-lg tracking-tight">Trim</span>
            <span className="ml-1 text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
              Beta
            </span>
          </div>
          <nav className="space-y-1 flex-1">
            {navigation.map((item) => {
              const active = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-secondary text-foreground border border-border/10 shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border pt-4 mt-auto">
            <div className="flex items-center gap-3 px-2">
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground border border-border shadow-xs">
                <User size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">Trim User</p>
                <p className="text-[10px] text-muted-foreground truncate">user@trim.so</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:pl-64">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center text-sm text-muted-foreground gap-1.5 font-medium">
              <span>Trim</span>
              <ChevronRight size={14} />
              <span className="text-foreground">{currentNav ? currentNav.name : "Analytics"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <Link2 size={14} />
              Docs
            </a>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
