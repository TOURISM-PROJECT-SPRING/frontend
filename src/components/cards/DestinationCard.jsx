import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";

export default function DestinationCard({ item }) {
  return (
    <Link
      to={item.href}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[18px] shadow-soft transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:shadow-lift"
    >
      <SmartImage
        src={item.image}
        alt={item.title}
        className="h-full w-full"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
        {item.attractions != null && (
          <p className="mt-0.5 text-xs font-medium text-white/75">{item.attractions} attractions</p>
        )}
      </div>
      <span className="absolute right-3 top-3 grid h-9 w-9 translate-y-1 place-items-center rounded-full bg-gold-400 text-brand-900 opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <Icon name="arrow-up-right" size={17} />
      </span>
    </Link>
  );
}
