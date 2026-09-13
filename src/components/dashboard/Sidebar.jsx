import { Link, useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import { dashboardNav } from "../../data/site";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-brand-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-brand-700 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5">
          <Link to="/">
            <Logo tone="light" />
          </Link>
        </div>

        <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {dashboardNav.map((item) => (
            <a
              key={item.label}
              href="#dashboard"
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                item.active
                  ? "bg-brand-600 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gold-400" />
              )}
              <Icon
                name={item.icon}
                size={19}
                className={item.active ? "text-gold-400" : "text-white/60 group-hover:text-gold-300"}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1.5 text-[11px] font-bold text-brand-900">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="mb-2 rounded-xl bg-brand-600/60 p-3">
            <p className="text-xs text-white/60">Cambodia</p>
            <p className="font-display text-sm font-bold text-gold-300">Always a good idea</p>
          </div>
          <Link
            to="/manager"
            onClick={onClose}
            className="mb-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon name="grid" size={19} />
            Management console
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon name="logout" size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
