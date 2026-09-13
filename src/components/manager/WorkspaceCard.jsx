import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";

export default function WorkspaceCard({ workspace, number }) {
  const num = String(number ?? 1).padStart(2, "0");

  return (
    <Link
      to={workspace.to}
      className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[22px] border border-line bg-brand-900 text-white shadow-soft outline-none transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-brand-300/50 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-brand-500/40"
    >
      <SmartImage
        src={workspace.image}
        alt=""
        className="absolute inset-0 h-full w-full"
        imgClassName="transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-transparent" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-950/50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 ring-1 ring-white/15 backdrop-blur">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-400 text-[10px] text-brand-900">
            {num}
          </span>
          Workspace
        </span>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-gold-300 ring-1 ring-white/20 backdrop-blur transition-colors duration-500 ease-out group-hover:bg-gold-400 group-hover:text-brand-900">
          <Icon name={workspace.icon} size={20} />
        </span>
      </div>

      <div className="relative z-10 p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300">{workspace.eyebrow}</p>
        <h3 className="mt-1.5 font-display text-2xl font-bold leading-tight">{workspace.title}</h3>
        <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-white/80">{workspace.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 backdrop-blur transition-colors duration-500 ease-out group-hover:bg-gold-400 group-hover:text-brand-900 group-hover:ring-transparent">
          {workspace.cta}
          <Icon name="arrow-right" size={16} className="transition-transform duration-500 ease-out group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}