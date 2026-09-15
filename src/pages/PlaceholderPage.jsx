import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/ui/Icon";

// Generic "coming soon" page for the Tour / Hotel / Restaurant tabs.
// The user will supply real prompts for these later.
export default function PlaceholderPage({ title = "Coming soon", icon = "compass", blurb }) {
  const [params] = useSearchParams();
  const q = params.get("q");

  return (
    <section className="mx-auto flex min-h-[62vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-500">
        <Icon name={icon} size={30} />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold text-brand-800 sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
        {q ? (
          <>
            Showing results for <strong className="text-brand-700">“{q}”</strong>. This section is coming soon — check back shortly.
          </>
        ) : (
          blurb || "This section is coming soon. We’re putting the finishing touches on it."
        )}
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800"
      >
        <Icon name="arrow-right" size={16} className="rotate-180" /> Back to Cambodia
      </Link>
    </section>
  );
}
