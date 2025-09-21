import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Tag,
  Menu,
  X,
  User,
  LogIn,
  HelpCircle,
  Info,
} from 'lucide-react';

// App shell with sticky top nav (desktop) + drawer sidebar (mobile)
const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [menuOpen, setMenuOpen] = useState(false);       // desktop user dropdown
  const menuRef = useRef(null);

  // Main navigation
  const navigation = useMemo(
    () => [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Expenses', href: '/expenses', icon: Receipt },
      { name: 'Categories', href: '/categories', icon: Tag },
    ],
    []
  );

  // Route change effects
  useEffect(() => setSidebarOpen(false), [location.pathname]);
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Close desktop menu on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Keyboard shortcuts: Ctrl/Cmd + 1/2/3
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === '1') { e.preventDefault(); navigate('/'); }
      if (e.key === '2') { e.preventDefault(); navigate('/expenses'); }
      if (e.key === '3') { e.preventDefault(); navigate('/categories'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  // Active link helper
  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Desktop: sticky top nav */}
      <header className="hidden lg:flex items-center justify-between bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200 px-6 h-16 shadow-sm sticky top-0 z-50">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-lg tracking-tight">
            Expense Tracker
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  active
                    ? 'text-blue-700 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Guest profile dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <span className="hidden xl:inline">Guest</span>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-900">Guest</p>
              </div>
              <ul className="py-1">
                <li>
                  <button
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                      alert('Sign in coming soon 😊');
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Help & Docs
                  </a>
                </li>
                <li>
                  <button
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                      alert('Expense Tracker — v' + (import.meta.env.VITE_APP_VERSION || '1.0.0'));
                    }}
                  >
                    <Info className="w-4 h-4" />
                    About
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Mobile: sticky header with hamburger */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <Receipt className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="w-6" />
      </header>

      {/* Mobile: sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 flex z-50">
          <div className="relative flex-1 flex flex-col w-64 bg-white border-r border-gray-200">
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-200">
              <span className="font-bold text-gray-800">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          active
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          <div className="flex-1 bg-gray-900/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Content */}
      <main className="flex-1 w-full p-4 sm:p-6">
        <div className="mx-auto max-w-7xl bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-4 sm:p-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="max-w-7xl mx-auto w-full px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Built with <span className="text-red-500">❤️</span> React & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
