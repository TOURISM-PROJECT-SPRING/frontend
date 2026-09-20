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
  ChevronLeft,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useOwnerBusiness } from "../../context/OwnerBusinessContext";
import { usePermissions } from "../../context/PermissionsContext";
import { permissionForPage } from "../../utils/permissions";
import Logo from "../ui/Logo";

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
      { icon: MapPin, text: "Tourist Places", path: "/admin/places", biz: "tour" },
      { icon: Hotel, text: "Hotels", path: "/admin/hotels", biz: "hotel" },
      { icon: BedDouble, text: "Rooms", path: "/admin/rooms", biz: "hotel" },
      { icon: Ticket, text: "Tickets", path: "/admin/tickets", biz: "tour" },
      { icon: UtensilsCrossed, text: "Restaurants", path: "/admin/restaurants", biz: "restaurant" },
      { icon: ShoppingBag, text: "Food & Orders", path: "/admin/food-orders", biz: "restaurant" },
      { icon: Package, text: "Tour Packages", path: "/admin/packages", biz: "tour" },
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
  const { isDark } = useTheme();
  const { businessTypes, isSuspended } = useOwnerBusiness();
  const { can } = usePermissions();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 flex flex-col z-40 overflow-hidden transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div
        className={`flex items-center h-14 border-b border-gray-100 dark:border-gray-800 shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
          collapsed ? "px-5" : "px-4"
        }`}
      >
        <Link
          to="/"
          aria-label="SovannDomNour admin panel"
          title={collapsed ? "SovannDomNour" : undefined}
          className="shrink-0 transition-transform active:scale-95"
        >
          <Logo tone={isDark ? "light" : "dark"} showText smooth collapsed={collapsed} />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        {sections.map((section) => {
          const visibleItems = isSuspended
            ? []
            : section.items.filter(
                (item) =>
                  (!item.biz || businessTypes.includes(item.biz)) &&
                  can(permissionForPage(item.path))
              );
          return (
          <div key={section.label} className="mb-4">
            <p
              className={`text-[10px] font-semibold text-gray-300 uppercase tracking-wider px-2.5 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                collapsed ? "max-h-0 mb-0 opacity-0" : "max-h-5 mb-1.5 opacity-100"
              }`}
            >
              {section.label}
            </p>
            <div className="space-y-0.5">
              {visibleItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center rounded-lg text-[13px] font-medium overflow-hidden transition-all duration-300 ease-in-out ${
                      collapsed ? "gap-0 px-[27px] py-2" : "gap-2.5 px-2.5 py-2"
                    } ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                    title={collapsed ? item.text : undefined}
                  >
                    <item.icon className="w-[18px] h-[18px] shrink-0" />
                    <span
                      className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                        collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"
                      }`}
                    >
                      {item.text}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-800 py-2.5 space-y-0.5">
        <Link
          to="/"
          className={`flex items-center rounded-lg text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
            collapsed ? "gap-0 px-[27px] py-2" : "gap-2.5 px-2.5 py-2"
          }`}
          title={collapsed ? "Back to Website" : undefined}
        >
          <Landmark className="w-[18px] h-[18px] shrink-0" />
          <span
            className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
              collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"
            }`}
          >
            Back to Website
          </span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={`flex items-center rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 overflow-hidden transition-all duration-300 ease-in-out w-full cursor-pointer ${
            collapsed ? "gap-0 px-[27px] py-2" : "gap-2.5 px-2.5 py-2"
          }`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          <span
            className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
              collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"
            }`}
          >
            Sign Out
          </span>
        </button>
        <button
          onClick={onToggle}
          className={`flex items-center rounded-lg text-[13px] font-medium text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 overflow-hidden transition-all duration-300 ease-in-out w-full ${
            collapsed ? "gap-0 px-[27px] py-2" : "gap-2.5 px-2.5 py-2"
          }`}
        >
          <ChevronLeft
            className={`w-[18px] h-[18px] shrink-0 transition-transform duration-300 ease-in-out ${
              collapsed ? "rotate-180" : ""
            }`}
          />
          <span
            className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
              collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"
            }`}
          >
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}
