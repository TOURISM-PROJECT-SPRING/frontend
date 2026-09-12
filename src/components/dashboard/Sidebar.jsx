import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Landmark,
  LayoutDashboard,
  Building2,
  BedDouble,
  CalendarCheck,
  Package,
  DollarSign,
  Star,
  Tag,
  BarChart3,
  Lightbulb,
  Wallet,
  UserCog,
  Users,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  UtensilsCrossed,
  ShoppingBag,
  Compass,
  Ticket,
  SlidersHorizontal,
  Check,
  Store,
} from "lucide-react";
import { useOwnerBusiness } from "../../context/OwnerBusinessContext";

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const {
    businessTypes,
    hasHotel,
    hasRestaurant,
    hasTour,
    toggleBusinessType,
    BUSINESS_TYPES,
  } = useOwnerBusiness();

  const [bizSelectorOpen, setBizSelectorOpen] = useState(false);

  // Dynamic sections generator based on active owner businesses
  const sections = [
    {
      label: "Overview",
      items: [{ icon: LayoutDashboard, text: "Dashboard", path: "/owner" }],
    },
  ];

  // 🏨 HOTEL SECTION - only if owner has Hotel business
  if (hasHotel) {
    sections.push({
      label: "Hotel & Stays",
      badge: "🏨 Hotel",
      items: [
        { icon: Building2, text: "Properties", path: "/owner/properties" },
        { icon: BedDouble, text: "Rooms", path: "/owner/rooms" },
        { icon: CalendarCheck, text: "Room Bookings", path: "/owner/bookings" },
        { icon: DollarSign, text: "Pricing & Availability", path: "/owner/pricing" },
      ],
    });
  }

  // 🍽️ RESTAURANT SECTION - only if owner has Restaurant business
  if (hasRestaurant) {
    sections.push({
      label: "Restaurant & Dining",
      badge: "🍽️ Dining",
      items: [
        { icon: UtensilsCrossed, text: "Restaurants", path: "/owner/restaurants" },
        { icon: UtensilsCrossed, text: "Menu & Dishes", path: "/owner/menu" },
        { icon: ShoppingBag, text: "Food Orders", path: "/owner/orders" },
      ],
    });
  }

  // 🎫 TOUR SECTION - only if owner has Tour business
  if (hasTour) {
    sections.push({
      label: "Tours & Experiences",
      badge: "🎫 Tours",
      items: [
        { icon: Compass, text: "Tour Places", path: "/owner/tours" },
        { icon: Ticket, text: "Tour Tickets", path: "/owner/tickets" },
        { icon: CalendarCheck, text: "Ticket Bookings", path: "/owner/ticket-bookings" },
        { icon: Package, text: "Packages", path: "/owner/packages" },
      ],
    });
  }

  // ENGAGEMENT & MARKETING
  sections.push({
    label: "Marketing",
    items: [
      { icon: Star, text: "Reviews", path: "/owner/reviews" },
      { icon: Tag, text: "Promotions", path: "/owner/promotions" },
    ],
  });

  // ANALYTICS
  sections.push({
    label: "Analytics",
    items: [
      { icon: BarChart3, text: "Reports", path: "/owner/reports" },
      { icon: Lightbulb, text: "Insights", path: "/owner/insights" },
    ],
  });

  // ACCOUNT
  sections.push({
    label: "Account",
    items: [
      { icon: Wallet, text: "Payouts", path: "/owner/payouts" },
      { icon: UserCircle, text: "My Profile", path: "/owner/profile" },
      { icon: UserCog, text: "Profile & Settings", path: "/owner/settings" },
      { icon: Users, text: "Team Members", path: "/owner/team" },
    ],
  });

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 flex flex-col z-40 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Branding */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <Landmark className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap block leading-tight">
              Smart Tourism
            </span>
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block">
              Owner Portal
            </span>
          </div>
        )}
      </div>

      {/* Business Type Active Badges & Switcher */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              My Businesses
            </span>
            <button
              onClick={() => setBizSelectorOpen(!bizSelectorOpen)}
              className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1"
              title="Configure business types"
            >
              <SlidersHorizontal className="w-3 h-3" />
              {bizSelectorOpen ? "Done" : "Configure"}
            </button>
          </div>

          {/* Quick active tags */}
          <div className="flex flex-wrap gap-1">
            {hasHotel && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                🏨 Hotel
              </span>
            )}
            {hasRestaurant && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                🍽️ Restaurant
              </span>
            )}
            {hasTour && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                🎫 Tour
              </span>
            )}
          </div>

          {/* Business Type Multi-Toggle Dropdown */}
          {bizSelectorOpen && (
            <div className="mt-2.5 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg space-y-1 animate-fade-in">
              <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 px-1 mb-1">
                Select your businesses:
              </p>
              {BUSINESS_TYPES.map((biz) => {
                const isActive = businessTypes.includes(biz.id);
                return (
                  <button
                    key={biz.id}
                    onClick={() => toggleBusinessType(biz.id)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span>{biz.badge}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                );
              })}
              <p className="text-[9px] text-gray-400 px-1 pt-1 border-t border-gray-100 dark:border-gray-700">
                Sidebar dynamically updates to show menus for your active businesses.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        {sections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <div className="flex items-center justify-between px-2.5 mb-1.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {section.label}
                </p>
                {section.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {section.badge}
                  </span>
                )}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                    } ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? item.text : undefined}
                  >
                    <item.icon className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && <span>{item.text}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-2.5 py-2.5 space-y-0.5">
        <Link
          to="/owner/help"
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Help Center" : undefined}
        >
          <HelpCircle className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Help Center</span>}
        </Link>
        <button
          onClick={onToggle}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px] shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-[18px] h-[18px] shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
