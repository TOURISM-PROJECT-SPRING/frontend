// Loading placeholder shaped like HotelListingCard.
export default function HotelCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-line bg-white sm:flex-row">
      <div className="h-52 w-full bg-brand-100/70 sm:h-auto sm:w-[300px] lg:w-[330px]" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-4 w-24 rounded-full bg-brand-100/70" />
        <div className="h-5 w-2/3 rounded bg-brand-100/80" />
        <div className="h-3 w-1/3 rounded bg-brand-100/60" />
        <div className="h-3 w-1/2 rounded bg-brand-100/60" />
        <div className="mt-auto h-3 w-3/4 rounded bg-brand-100/50" />
      </div>
      <div className="flex items-end gap-2 border-t border-line p-5 sm:w-52 sm:flex-col sm:justify-start sm:border-l sm:border-t-0">
        <div className="h-7 w-20 rounded bg-brand-100/80" />
        <div className="h-4 w-32 rounded bg-brand-100/50" />
        <div className="h-11 w-full rounded-full bg-brand-100/70" />
      </div>
    </div>
  );
}
