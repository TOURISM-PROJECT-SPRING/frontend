import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Send, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-primary to-primary-dark rounded-3xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDJ2Mmgydi0yem0wLThoLTJ2MmgyVjI2ek0yNCAyNGgtMnYyaDJ2LTJ6bTAtNGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

          <div className="relative px-6 sm:px-10 py-12 sm:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {t("newsletter.title")}
            </h2>
            <p className="text-sm text-white/70 max-w-md mx-auto mb-8">
              {t("newsletter.subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  required
                  className="w-full px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-white/40 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition shadow-lg shrink-0"
              >
                {submitted ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> {t("newsletter.subscribed")}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> {t("newsletter.subscribe")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
