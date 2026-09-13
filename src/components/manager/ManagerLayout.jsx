import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import { WORKSPACES, WORKSPACE_ORDER, workspaceForPath } from "../../data/managerConfig";
import { useAuth } from "../../context/AuthContext";

function NavItem({ item, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
          isActive ? "bg-brand-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gold-400" />}
          <Icon name={item.icon} size={19} className={isActive ? "text-gold-400" : "text-white/55 group-hover:text-gold-300"} />
          <span className="flex-1 truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function Sidebar({ ws, open, onClose }) {
  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-40 bg-brand-950/50 backdrop-blur-sm lg:hidden" />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-brand-700 text-white transition-transform duration-300 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5">
          <Link to="/manager" onClick={onClose}>
            <Logo tone="light" />
          </Link>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-gold-300">
            <Icon name={ws.icon} size={13} /> {ws.name}
          </p>
        </div>

        <nav className="mt-1 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {ws.nav.map((entry) =>
            entry.items ? (
              <div key={entry.label} className="pt-3">
                <p className="px-3.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">{entry.label}</p>
                {entry.items.map((it) => (
                  <NavItem key={it.to + it.label} item={it} onNavigate={onClose} />
                ))}
              </div>
            ) : (
              <NavItem key={entry.to + entry.label} item={entry} onNavigate={onClose} />
            )
          )}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon name="arrow-up-right" size={18} /> Back to platform
          </Link>
        </div>
      </aside>
    </>
  );
}

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const current = workspaceForPath(location.pathname);
  const ws = WORKSPACES[current] || WORKSPACES.tour;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-bold text-brand-800 hover:bg-brand-50"
      >
        <Icon name={ws.icon} size={16} className="text-brand-600" />
        <span className="hidden sm:inline">{ws.name}</span>
        <Icon name="chevron-down" size={15} className="text-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-60 origin-top-right animate-scalein overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift">
            <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">Switch workspace</p>
            {WORKSPACE_ORDER.map((key) => {
              const w = WORKSPACES[key];
              const active = key === current;
              return (
                <Link
                  key={key}
                  to={w.base}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active ? "bg-brand-50 text-brand-700" : "text-ink/80 hover:bg-brand-50"
                  }`}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-gold-400">
                    <Icon name={w.icon} size={16} />
                  </span>
                  <span className="flex-1">{w.name}</span>
                  {active && <Icon name="check" size={16} className="text-brand-600" />}
                </Link>
              );
            })}
            <div className="my-1 h-px bg-line" />
            <Link
              to="/manager"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/80 hover:bg-brand-50"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold-400 text-brand-900">
                <Icon name="grid" size={16} />
              </span>
              Choose workspace
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function Header({ ws, onMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const flat = ws.nav.flatMap((e) => (e.items ? e.items : [e]));
  const current = flat.find((e) => e.to === location.pathname);
  const title = current ? current.label : ws.title;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-canvas/85 px-4 py-3 backdrop-blur sm:px-6">
      <button onClick={onMenu} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-brand-800 lg:hidden">
        <Icon name="menu" size={20} />
      </button>

      <div className="hidden min-w-0 md:block">
        <p className="truncate text-[11px] font-medium text-muted">
          {ws.name} <span className="text-line">/</span> <span className="font-semibold text-brand-700">{title}</span>
        </p>
        <h1 className="truncate font-display text-lg font-bold text-brand-800">{title}</h1>
      </div>

      <label className="ml-auto hidden h-10 flex-1 items-center gap-2.5 rounded-xl border border-line bg-white px-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 lg:flex lg:max-w-sm">
        <Icon name="search" size={17} className="text-muted" />
        <input placeholder="Search…" className="w-full bg-transparent text-sm focus:outline-none" />
      </label>

      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <button className="hidden h-10 items-center gap-1 rounded-xl px-2 text-sm font-semibold text-ink/70 hover:bg-white sm:flex">
          EN <Icon name="chevron-down" size={14} />
        </button>
        <WorkspaceSwitcher />
        <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-brand-800 hover:bg-brand-50">
          <Icon name="bell" size={19} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold-400 ring-2 ring-canvas" />
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white py-1.5 pl-1.5 pr-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-sm font-bold text-gold-400">
            {(user?.fullname || "SD").slice(0, 2).toUpperCase()}
          </span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            aria-label="Logout"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-brand-50 hover:text-danger"
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default function ManagerLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const wsKey = workspaceForPath(location.pathname) || "tour";
  const ws = WORKSPACES[wsKey];

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar ws={ws} open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-72">
        <Header ws={ws} onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
