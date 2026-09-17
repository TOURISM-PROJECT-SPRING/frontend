import { Link, useLocation } from "react-router-dom";
import {
  Landmark,
  LayoutDashboard,
  Building2,
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
} from "lucide-react";

const sections = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, text: "Dashboard", path: "/owner" },
    ],
  },
  {
    label: "Manage",
    items: [
      { icon: Building2, text: "Properties", path: "/owner/properties" },
      { icon: CalendarCheck, text: "Bookings", path: "/owner/bookings" },
      { icon: Package, text: "Packages", path: "/owner/packages" },
      { icon: DollarSign, text: "Pricing & Availability", path: "/owner/pricing" },
      { icon: Star, text: "Reviews", path: "/owner/reviews" },
      { icon: Tag, text: "Promotions", path: "/owner/promotions" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { icon: BarChart3, text: "Reports", path: "/owner/reports" },
      { icon: Lightbulb, text: "Insights", path: "/owner/insights" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: Wallet, text: "Payouts", path: "/owner/payouts" },
      { icon: UserCircle, text: "My Profile", path: "/owner/profile" },
      { icon: UserCog, text: "Profile & Settings", path: "/owner/settings" },
      { icon: Users, text: "Team Members", path: "/owner/team" },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

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
          <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap truncate">
            SovannDomNour
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        {sections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider px-2.5 mb-1.5">
                {section.label}
              </p>
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
                        ? "bg-primary/10 text-primary"
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
