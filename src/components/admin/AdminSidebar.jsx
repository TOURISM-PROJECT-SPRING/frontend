import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Landmark,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  MapPin,
  Hotel,
  BedDouble,
  Ticket,
  UtensilsCrossed,
  ShoppingBag,
  Package,
  CalendarCheck,
  Wallet,
  Star,
  Tag,
  Bell,
  Mail,
  BarChart3,
  ScrollText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const sections = [
  {
    label: "Dashboard",
    items: [
      { icon: LayoutDashboard, text: "Dashboard", path: "/admin" },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: Users, text: "Users", path: "/admin/users" },
      { icon: ShieldCheck, text: "Roles & Permissions", path: "/admin/roles" },
      { icon: Building2, text: "Owners / Businesses", path: "/admin/owners" },
      { icon: MapPin, text: "Tourist Places", path: "/admin/places" },
      { icon: Hotel, text: "Hotels", path: "/admin/hotels" },
      { icon: BedDouble, text: "Rooms", path: "/admin/rooms" },
      { icon: Ticket, text: "Tickets", path: "/admin/tickets" },
      { icon: UtensilsCrossed, text: "Restaurants", path: "/admin/restaurants" },
      { icon: ShoppingBag, text: "Food & Orders", path: "/admin/food-orders" },
      { icon: Package, text: "Tour Packages", path: "/admin/packages" },
      { icon: CalendarCheck, text: "Bookings", path: "/admin/bookings" },
      { icon: Wallet, text: "Payments", path: "/admin/payments" },
      { icon: Star, text: "Reviews & Ratings", path: "/admin/reviews" },
      { icon: Tag, text: "Promotions", path: "/admin/promotions" },
      { icon: Bell, text: "Notifications", path: "/admin/notifications" },
      { icon: Mail, text: "Contact Messages", path: "/admin/contact-messages" },
    ],
  },
  {
    label: "Reports & Settings",
    items: [
      { icon: BarChart3, text: "Reports", path: "/admin/reports" },
      { icon: ScrollText, text: "System Logs", path: "/admin/logs" },
      { icon: UserCircle, text: "My Profile", path: "/admin/profile" },
      { icon: Settings, text: "Settings", path: "/admin/settings" },
    ],
  },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 flex flex-col z-40 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div className="flex items-center gap-3 px-5 h-14 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <Landmark className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap truncate">
            Smart Tourism Admin Panel
          </span>
        )}
      </div>

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

      <div className="border-t border-gray-100 dark:border-gray-800 px-2.5 py-2.5 space-y-0.5">
        <Link
          to="/admin/help"
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Help Center" : undefined}
        >
          <HelpCircle className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Help Center</span>}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition w-full cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
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
