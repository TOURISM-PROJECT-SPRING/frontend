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
  Lock,
} from "lucide-react";
import { useOwnerBusiness } from "../../context/OwnerBusinessContext";

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const {
    hasHotel,
    hasRestaurant,
    hasTour,
    isBusinessLocked,
  } = useOwnerBusiness();

  // Dynamic sections generator based on active & locked owner businesses
  const sections = [
    {
      label: "Overview",
      items: [{ icon: LayoutDashboard, text: "Dashboard", path: "/owner" }],
    },
  ];

  // 🏨 HOTEL SECTION
  sections.push({
    label: "Hotel & Stays",
    bizId: "hotel",
    isLocked: isBusinessLocked("hotel"),
    badge: hasHotel ? "🏨 Hotel" : "🔒 Locked",
    items: [
      { icon: Building2, text: "Properties", path: "/owner/properties" },
      { icon: BedDouble, text: "Rooms", path: "/owner/rooms" },
      { icon: CalendarCheck, text: "Room Bookings", path: "/owner/bookings" },
      { icon: DollarSign, text: "Pricing & Availability", path: "/owner/pricing" },
    ],
  });

  // 🍽️ RESTAURANT SECTION
  sections.push({
    label: "Restaurant & Dining",
    bizId: "restaurant",
    isLocked: isBusinessLocked("restaurant"),
    badge: hasRestaurant ? "🍽️ Dining" : "🔒 Locked",
    items: [
      { icon: UtensilsCrossed, text: "Restaurants", path: "/owner/restaurants" },
      { icon: UtensilsCrossed, text: "Menu & Dishes", path: "/owner/menu" },
      { icon: ShoppingBag, text: "Food Orders", path: "/owner/orders" },
    ],
  });

  // 🎫 TOUR / TOURISTS SECTION
  sections.push({
    label: "Tourists & Tours",
    bizId: "tour",
    isLocked: isBusinessLocked("tour"),
    badge: hasTour ? "🎫 Tours" : "🔒 Locked",
    items: [
      { icon: Compass, text: "Tour Places", path: "/owner/tours" },
      { icon: Ticket, text: "Tour Tickets", path: "/owner/tickets" },
      { icon: CalendarCheck, text: "Ticket Bookings", path: "/owner/ticket-bookings" },
      { icon: Package, text: "Packages", path: "/owner/packages" },
    ],
  });

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
        <div className="w-8 h-8 bg-[#1b3b2b] rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-[#2d6a4f]/30">
          <Landmark className="w-4 h-4 text-[#f4b938]" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap block leading-tight tracking-tight">
              Smart Tourism
            </span>
            <span className="text-[10px] font-bold text-[#1b3b2b] dark:text-emerald-400 uppercase tracking-wider block">
              Owner Portal
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        {sections.map((section) => {
          const isLocked = section.isLocked;

          return (
            <div
              key={section.label}
              className={`mb-4 transition-all ${
                isLocked ? "opacity-70 hover:opacity-90" : ""
              }`}
            >
              {!collapsed && (
                <div className="flex items-center justify-between px-2.5 mb-1.5">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    {section.label}
                  </p>
                  {section.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isLocked
                          ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                          : "bg-[#edf5f0] text-[#1b3b2b] border border-[#1b3b2b]/20 dark:bg-[#16291e] dark:text-emerald-300"
                      }`}
                    >
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
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all ${
                        isActive
                          ? "bg-[#1b3b2b] text-white shadow-xs font-semibold dark:bg-[#1b3b2b] dark:text-emerald-100"
                          : isLocked
                          ? "text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
                          : "text-gray-600 dark:text-gray-300 hover:bg-[#edf5f0] hover:text-[#1b3b2b] dark:hover:bg-[#16291e] dark:hover:text-emerald-200"
                      } ${collapsed ? "justify-center" : ""}`}
                      title={
                        collapsed
                          ? isLocked
                            ? `${item.text} (Locked - Admin Managed)`
                            : item.text
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#f4b938]" : ""}`} />
                        {!collapsed && <span className="truncate">{item.text}</span>}
                      </div>

                      {!collapsed && isLocked && (
                        <Lock className="w-3 h-3 text-gray-400 dark:text-gray-600 shrink-0 ml-1.5" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
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
