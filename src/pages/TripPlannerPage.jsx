import SovannAiChat from "../components/ai/SovannAiChat";

export default function TripPlannerPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-brand-800 sm:text-4xl">
            Trip Planner
          </h1>
          <p className="mt-1 max-w-lg text-sm text-muted">
            Design a day-by-day Cambodia itinerary with Sovann — choose a destination, duration, budget, and travel style.
          </p>
        </div>
      </div>
      <div className="h-[68vh] min-h-[520px]">
        <SovannAiChat embedded initialTab="planner" />
      </div>
    </section>
  );
}