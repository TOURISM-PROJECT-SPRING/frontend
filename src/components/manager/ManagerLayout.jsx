import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import { UNIFIED_NAV, UNIFIED_BOTTOM_NAV } from "../../data/managerConfig";
import { useAuth } from "../../context/AuthContext";
import { canAccess } from "../../utils/rbac";

const BOTTOM_PATHS = new Set(UNIFIED_BOTTOM_NAV.map((i) => i.to));

// Only show nav entries the current role is allowed to reach. Groups whose
// every item is inaccessible are dropped entirely.
function navForUser(user) {
  return UNIFIED_NAV.flatMap((entry) => {
    if (!entry.items) return canAccess(user, entry.to) ? [entry] : [];
    const items = entry.items.filter((it) => canAccess(user, it.to));
    return items.length ? [{ ...entry, items }] : [];
  });
}

function bottomNavForUser(user) {
  return UNIFIED_BOTTOM_NAV.filter((it) => canAccess(user, it.to));
}

function isPathActive(pathname, to) {
  if (to === "/manager") return pathname === "/manager";
  if (BOTTOM_PATHS.has(pathname)) return pathname === to;
  return pathname === to || pathname.startsWith(to);
}

function groupIsActive(entry, pathname) {
  return entry.items.some((it) => isPathActive(pathname, it.to));
}

function activeGroupLabel(nav, pathname) {
  const entry = nav.find((e) => e.items && groupIsActive(e, pathname));
  return entry?.label;
}

function NavItem({ item, collapsed = false, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      end
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
          collapsed ? "lg:justify-center lg:px-2" : "hover:translate-x-1"
        } ${
          isActive
            ? "bg-brand-700 text-white shadow-soft"
            : "text-ink/70 hover:bg-brand-50 hover:text-brand-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gold-400" />
          )}
          <Icon
            name={item.icon}
            size={19}
            className={`shrink-0 transition-colors ${
              isActive ? "text-gold-400" : "text-brand-400 group-hover:text-brand-600"
            }`}
          />
          <span className={`flex-1 truncate transition-opacity ${collapsed ? "lg:hidden" : ""}`}>
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}

function GroupItem({ entry, open, collapsed, onToggle, onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const active = groupIsActive(entry, location.pathname);

  return (
    <div className="pt-3">
      <button
        type="button"
        onClick={() => (collapsed ? navigate(entry.items[0].to) : onToggle(entry.label))}
        aria-expanded={collapsed ? undefined : open}
        title={collapsed ? entry.label : undefined}
        className={`group flex w-full items-center rounded-xl text-sm font-bold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
          collapsed ? "justify-center px-2 py-2.5 lg:justify-center" : "gap-3 px-3.5 py-2.5"
        } ${active ? "text-brand-800" : "text-ink/55 hover:bg-brand-50 hover:text-brand-800"}`}
      >
        <Icon
          name={entry.icon}
          size={19}
          className={`shrink-0 transition-colors ${
            active ? "text-brand-600" : "text-brand-400 group-hover:text-brand-500"
          }`}
        />
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-left">{entry.label}</span>
            <Icon
              name="chevron-down"
              size={15}
              className={`shrink-0 text-muted transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {!collapsed && (
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-1 ml-2.5 space-y-1 border-l-2 border-line pl-2.5">
              {entry.items.map((it) => (
                <NavItem key={it.to + it.label} item={it} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Sidebar({ open, collapsed, onClose }) {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const nav = useMemo(() => navForUser(user), [user]);
  const bottomNav = useMemo(() => bottomNavForUser(user), [user]);
  const [openGroups, setOpenGroups] = useState(() => {
    const label = activeGroupLabel(nav, location.pathname);
    return new Set(label ? [label] : []);
  });

  useEffect(() => {
    const label = activeGroupLabel(nav, location.pathname);
    if (label) setOpenGroups((prev) => new Set(prev).add(label));
  }, [location.pathname, nav]);

  const toggleGroup = (label) => {
    const entry = nav.find((e) => e.label === label);
    const locked =
      entry?.items && groupIsActive(entry, location.pathname) && openGroups.has(label);
    if (locked) return;
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-brand-950/40 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-white transition-[width,transform] duration-300 ease-out lg:translate-x-0 ${
          collapsed ? "lg:w-20" : "lg:w-72"
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex h-16 shrink-0 items-center border-b border-line px-5 ${
            collapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          <Link
            to="/manager"
            onClick={onClose}
            className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
          >
            <Logo tone="dark" showText={!collapsed} />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
          {nav.map((entry) =>
            entry.items ? (
              <GroupItem
                key={entry.label}
                entry={entry}
                open={openGroups.has(entry.label)}
                collapsed={collapsed}
                onToggle={toggleGroup}
                onNavigate={onClose}
              />
            ) : (
              <NavItem
                key={entry.to + entry.label}
                item={entry}
                collapsed={collapsed}
                onNavigate={onClose}
              />
            )
          )}
        </nav>

        <div className="shrink-0 border-t border-line p-3">
          <div className="space-y-1">
            {bottomNav.map((it) => (
              <NavItem key={it.to} item={it} collapsed={collapsed} onNavigate={onClose} />
            ))}
          </div>
          <Link
            to="/"
            onClick={onClose}
            className="mt-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-muted outline-none transition-colors duration-200 hover:bg-brand-50 hover:text-brand-800 focus-visible:ring-2 focus-visible:ring-brand-500/40"
          >
            <Icon name="arrow-up-right" size={18} className="shrink-0" />
            <span className={`truncate ${collapsed ? "lg:hidden" : ""}`}>{t("managerLayout.backToPlatform")}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

function currentTitle(pathname, nav, bottom) {
  const flat = [...nav.flatMap((e) => (e.items ? e.items : [e])), ...bottom];
  const exact = flat.find((e) => e.to === pathname);
  if (exact) return exact.label;
  const nested = flat
    .filter((e) => e.to !== "/manager")
    .sort((a, b) => b.to.length - a.to.length)
    .find((e) => pathname.startsWith(e.to));
  return nested ? nested.label : "Management Console";
}

function Header({ onMenu, collapsed, onToggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const title = currentTitle(location.pathname, navForUser(user), bottomNavForUser(user));

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2.5 border-b border-line bg-canvas/85 px-4 py-3 backdrop-blur sm:gap-3 sm:px-6">
      <button
        onClick={onMenu}
        aria-label={t("managerLayout.menuLabel")}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white text-brand-800 lg:hidden"
      >
        <Icon name="menu" size={20} />
      </button>

      <button
        onClick={onToggleCollapse}
        aria-label={collapsed ? t("managerLayout.expandSidebar") : t("managerLayout.collapseSidebar")}
        className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white text-brand-800 transition-colors hover:bg-brand-50 lg:grid"
      >
        <Icon
          name="chevron-right"
          size={18}
          className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
        />
      </button>

      <div className="flex min-w-0 flex-1 items-center">
        <p className="truncate text-sm font-bold text-brand-800 lg:hidden">{title}</p>
        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-[11px] font-medium text-muted">
            Management Console <span className="text-line">/</span>{" "}
            <span className="font-semibold text-brand-700">{title}</span>
          </p>
          <h1 className="truncate font-display text-lg font-bold leading-tight text-brand-800">
            {title}
          </h1>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <label className="hidden h-10 w-64 max-w-xs items-center gap-2.5 rounded-xl border border-line bg-white px-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 lg:flex">
          <Icon name="search" size={17} className="text-muted" />
          <input placeholder={t("managerLayout.searchPh")} className="w-full bg-transparent text-sm focus:outline-none" />
        </label>
        <button className="hidden h-10 items-center gap-1 rounded-xl px-2 text-sm font-semibold text-ink/70 hover:bg-white sm:flex">
          EN <Icon name="chevron-down" size={14} />
        </button>
        <button aria-label={t("managerLayout.notifications")} className="relative grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-brand-800 hover:bg-brand-50">
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
            aria-label={t("managerLayout.logout")}
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
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar open={open} collapsed={collapsed} onClose={() => setOpen(false)} />
      <div
        className={`transition-[padding] duration-300 ease-out ${
          collapsed ? "lg:pl-20" : "lg:pl-72"
        }`}
      >
        <Header
          onMenu={() => setOpen(true)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}