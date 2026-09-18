// Loading placeholder shaped like RestaurantCard (photo + text lines).
export default function RestaurantCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5 border-b border-line pb-9 sm:flex-row sm:gap-6">
      <div className="aspect-[4/3] w-full shrink-0 rounded-2xl bg-brand-100/70 sm:aspect-square sm:w-[300px] lg:w-[350px]" />
      <div className="flex flex-1 flex-col gap-3 pt-1">
        <div className="h-6 w-2/3 rounded bg-brand-100/80" />
        <div className="h-4 w-1/2 rounded bg-brand-100/60" />
        <div className="h-4 w-2/5 rounded bg-brand-100/60" />
        <div className="mt-2 h-3 w-11/12 rounded bg-brand-100/50" />
        <div className="h-3 w-4/5 rounded bg-brand-100/50" />
        <div className="h-6 w-24 rounded-full bg-brand-100/50" />
      </div>
    </div>
  );
}
