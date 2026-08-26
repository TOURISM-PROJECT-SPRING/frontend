import { HelpCircle, Search, ChevronDown, MessageSquare, Mail } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "How do I add a new property?", a: "Go to Properties > Add Property. Fill in the required details including name, location, room types, and pricing. Upload high-quality photos and save." },
  { q: "How do I update room pricing?", a: "Navigate to Pricing & Availability. Select the property and room type you want to update. Edit the weekday, weekend, and peak rates, then save changes." },
  { q: "How do I respond to guest reviews?", a: "Go to Reviews, find the review you want to respond to, and click the Reply button. Type your response and submit." },
  { q: "How do I create a promotion?", a: "Go to Promotions > Create Promotion. Set the discount type (percentage or fixed amount), code, valid dates, and applicable properties." },
  { q: "How do I view my payout history?", a: "Navigate to Payouts to see all completed and pending payouts. You can export your statement for accounting purposes." },
  { q: "How do I add team members?", a: "Go to Team Members > Invite Member. Enter their email address and assign a role (Manager or Staff). They'll receive an invitation email." },
];

export default function OwnerHelpPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help Center</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Find answers to common questions</p>
      </div>

      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          type="text"
          placeholder="Search for help..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {filtered.map((faq, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
            </button>
            {openFaq === i && (
              <div className="px-5 pb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 text-center">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Still need help?</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Our support team is available 24/7</p>
        <div className="flex items-center justify-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
            <MessageSquare className="w-4 h-4" />
            Live Chat
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <Mail className="w-4 h-4" />
            Email Support
          </button>
        </div>
      </div>
    </div>
  );
}
