import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";

// Deterministic themed fallbacks so provinces without photos still feel distinct.
const GRADIENTS = [
  "from-brand-800 via-brand-600 to-brand-500",
  "from-emerald-800 via-teal-600 to-emerald-500",
  "from-amber-700 via-amber-600 to-gold-500",
  "from-indigo-800 via-violet-600 to-indigo-500",
  "from-rose-800 via-rose-600 to-amber-500",
  "from-sky-800 via-sky-600 to-cyan-500",
];

function pickGradient(seed = "") {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

export default function DestinationCard({ item }) {
  const href = item.href || `/explore?province=${encodeURIComponent(item.name || item.title || "")}`;
  const title = item.name || item.title || "Destination";
  const count = item.attractions || item.toursCount || null;
  const gradient = pickGradient(title);

  return (
    <Link
      to={href}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border border-line shadow-soft outline-none transition-all duration-500 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
    >
      {/* Background Image */}
      <SmartImage
        src={item.image}
        alt={title}
        className="h-full w-full"
        imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        glyphClassName={`bg-gradient-to-br ${gradient}`}
      />

      {/* Gradient Overlay - permanent soft bottom shadow for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent transition-opacity duration-300 group-hover:from-brand-950/95" />

      {/* Top right icon button */}
      <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-brand-900 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:bg-gold-400 group-hover:scale-110">
        <Icon name="arrow-up-right" size={15} />
      </span>

      {/* Bottom details - permanently visible with smooth hover lift */}
      <div className="absolute inset-x-0 bottom-0 p-4 transition-transform duration-300 group-hover:-translate-y-1">
        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gold-300">
          Cambodia
        </span>
        <h3 className="font-display text-lg font-bold text-white leading-snug">
          {title}
        </h3>
        <div className="mt-1 flex items-center justify-between text-xs text-white/80">
          <span>{count != null ? `${count} curated experiences` : "Must-see province"}</span>
          <span className="text-[11px] font-bold text-gold-300 group-hover:underline">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}