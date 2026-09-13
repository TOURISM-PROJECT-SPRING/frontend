import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";

export default function DestinationCard({ item }) {
  return (
    <Link
      to={item.href}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[18px] border border-white/0 shadow-soft outline-none transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-1.5 hover:border-brand-300/60 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-brand-500/40"
    >
      <SmartImage
        src={item.image}
        alt={item.title}
        className="h-full w-full"
        imgClassName="transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
        {item.attractions != null && (
          <p className="mt-0.5 text-xs font-medium text-white/75">{item.attractions} attractions</p>
        )}
      </div>
      <span className="absolute right-3 top-3 grid h-9 w-9 translate-y-1 place-items-center rounded-full bg-gold-400 text-brand-900 opacity-0 shadow-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
        <Icon name="arrow-up-right" size={17} />
      </span>
    </Link>
  );
}
