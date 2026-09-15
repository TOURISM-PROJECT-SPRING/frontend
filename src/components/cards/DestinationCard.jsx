import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";

export default function DestinationCard({ item }) {
  return (
    <Link
      to={item.href}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[18px] border border-white/0 shadow-soft outline-none transition-[transform,box-shadow,border-color] duration-700 ease-in will-change-transform hover:-translate-y-1 hover:border-brand-300/60 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-brand-500/40"
    >
      {/* Background Image */}
      <SmartImage
        src={item.image}
        alt={item.title}
        className="h-full w-full"
        imgClassName="transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
      />

      {/* Dark overlay - Fades in on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />

      {/* Top right icon - Slides in on hover */}
      <span className="absolute right-3 top-3 grid h-9 w-9 -translate-y-2 place-items-center rounded-full bg-gold-400 text-brand-900 opacity-0 shadow-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
        <Icon name="arrow-up-right" size={17} />
      </span>

      {/* Bottom details & button - Slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-5 text-center translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
        {item.attractions != null && (
          <p className="mt-0.5 text-xs font-medium text-white/75">{item.attractions} attractions</p>
        )}
        
        <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-brand-800 backdrop-blur">
          <Icon name="eye" size={14} className="text-brand-600" /> View Destination
        </span>
      </div>
    </Link>
  );
}