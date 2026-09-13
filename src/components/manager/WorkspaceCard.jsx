import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";

export default function WorkspaceCard({ workspace }) {
  return (
    <Link
      to={workspace.to}
      className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[22px] border border-line bg-brand-800 p-6 text-white shadow-soft transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lift"
    >
      <SmartImage
        src={workspace.image}
        alt=""
        className="absolute inset-0 h-full w-full opacity-40"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/70 to-brand-900/30" />
      <div className="khmer-motif absolute inset-0 opacity-30" />

      <div className="relative">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-400 text-brand-900 shadow-md">
          <Icon name={workspace.icon} size={28} />
        </span>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-gold-300">{workspace.eyebrow}</p>
        <h3 className="mt-1 font-display text-2xl font-bold">{workspace.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/75">{workspace.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 backdrop-blur transition-colors group-hover:bg-gold-400 group-hover:text-brand-900">
          {workspace.cta}
          <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
