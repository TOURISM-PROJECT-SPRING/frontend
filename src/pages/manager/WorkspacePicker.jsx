import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/ui/Logo";
import Icon from "../../components/ui/Icon";
import WorkspaceCard from "../../components/manager/WorkspaceCard";
import { PICKER, WORKSPACE_ORDER } from "../../data/managerConfig";
import { useAuth } from "../../context/AuthContext";

export default function WorkspacePicker() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.fullname || user?.username || "Manager";

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2.5 rounded-xl border border-line bg-white py-1.5 pl-1.5 pr-3 sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-sm font-bold text-gold-400">
                {name.slice(0, 2).toUpperCase()}
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold text-brand-800">{name}</span>
                <span className="block text-[11px] text-muted">Manager</span>
              </span>
            </div>
            <Link to="/" className="hidden text-sm font-semibold text-muted hover:text-brand-700 sm:inline">
              Back to platform
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-bold text-brand-800 hover:bg-brand-50"
            >
              <Icon name="logout" size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-gold-400" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">Management console</span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-brand-800 sm:text-5xl">
            Choose Your Workspace
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Pick a business to manage. Each workspace has its own tools, dashboards and operations —
            you can switch anytime from the header.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {WORKSPACE_ORDER.map((key) => (
            <WorkspaceCard key={key} workspace={PICKER[key]} />
          ))}
        </div>

        <div className="mt-12 flex items-center gap-2 rounded-2xl border border-line bg-white p-4 text-sm text-muted shadow-soft">
          <Icon name="info" size={18} className="shrink-0 text-brand-500" />
          Demo console — data shown is sample content until connected to the live Spring Boot APIs.
        </div>
      </main>
    </div>
  );
}
