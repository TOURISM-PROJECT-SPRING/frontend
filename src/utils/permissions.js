export const PERMISSION_GROUPS = [
  {
    category: "Users & Access Control",
    permissions: [
      { id: "users.view", label: "View User Accounts" },
      { id: "users.create", label: "Create Users" },
      { id: "users.edit", label: "Edit Profiles & Roles" },
      { id: "users.delete", label: "Delete User Accounts" },
    ],
  },
  {
    category: "Accommodations & Stays",
    permissions: [
      { id: "hotels.view", label: "View Hotels & Properties" },
      { id: "hotels.edit", label: "Create & Edit Hotels" },
      { id: "rooms.manage", label: "Manage Room Inventory" },
      { id: "bookings.view", label: "Manage Room Reservations" },
    ],
  },
  {
    category: "Restaurants & Dining",
    permissions: [
      { id: "dining.view", label: "View Dining Listings" },
      { id: "menu.manage", label: "Manage Food Items & Menus" },
      { id: "orders.manage", label: "Process Food Orders" },
    ],
  },
  {
    category: "Attractions & Tours",
    permissions: [
      { id: "places.manage", label: "Manage Tourist Attractions" },
      { id: "tickets.manage", label: "Manage Entrance Tickets" },
      { id: "packages.manage", label: "Manage Packages & Guides" },
    ],
  },
  {
    category: "Financials & Platform Settings",
    permissions: [
      { id: "payments.view", label: "Inspect Ledger & KHQR Payments" },
      { id: "payouts.manage", label: "Manage Partner Payouts" },
      { id: "reports.export", label: "Export Financial Reports" },
      { id: "settings.edit", label: "Modify System Settings" },
      { id: "logs.view", label: "Audit System Security Logs" },
    ],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.id)
);

export const DEFAULT_ROLES = [
  {
    id: 1,
    name: "ADMIN",
    label: "Super Administrator",
    description:
      "Full administrative privileges across user accounts, destinations, hotels, financial reconciliations, and global settings.",
    userCount: 3,
    color: "purple",
    isSystem: true,
    permissions: [...ALL_PERMISSIONS],
  },
  {
    id: 2,
    name: "OWNER",
    label: "Business & Property Partner",
    description:
      "Full management rights over registered properties, room inventories, dining menus, tour packages, and payout accounts.",
    userCount: 14,
    color: "green",
    isSystem: true,
    permissions: [
      "hotels.view",
      "hotels.edit",
      "rooms.manage",
      "bookings.view",
      "dining.view",
      "menu.manage",
      "orders.manage",
      "places.manage",
      "tickets.manage",
      "packages.manage",
      "payments.view",
      "payouts.manage",
      "reports.export",
    ],
  },
  {
    id: 3,
    name: "MANAGER",
    label: "Operations Manager",
    description:
      "Operational supervisor rights over day-to-day reservations, guest check-ins, kitchen order boards, and place ticket verifications.",
    userCount: 8,
    color: "blue",
    isSystem: false,
    permissions: [
      "hotels.view",
      "rooms.manage",
      "bookings.view",
      "dining.view",
      "orders.manage",
      "places.manage",
      "tickets.manage",
      "reports.export",
    ],
  },
  {
    id: 4,
    name: "USER",
    label: "Customer & Tourist",
    description:
      "Default public traveler role for browsing attractions, making room & ticket bookings, dining reservations, and Bakong KHQR payments.",
    userCount: 4820,
    color: "emerald",
    isSystem: true,
    permissions: ["hotels.view", "dining.view", "places.manage", "bookings.view"],
  },
];

export const PAGE_PERMISSIONS = {
  users: "users.view",
  roles: "users.edit",
  owners: "users.view",
  places: "places.manage",
  hotels: "hotels.view",
  rooms: "rooms.manage",
  tickets: "tickets.manage",
  restaurants: "dining.view",
  "food-orders": "orders.manage",
  packages: "packages.manage",
  bookings: "bookings.view",
  payments: "payments.view",
  reviews: "users.edit",
  promotions: "settings.edit",
  notifications: "settings.edit",
  "contact-messages": "users.view",
  reports: "reports.export",
  logs: "logs.view",
  settings: "settings.edit",
};

export function permissionForPage(path) {
  const key = String(path || "")
    .split("/")
    .filter(Boolean)
    .pop();
  return PAGE_PERMISSIONS[key] || null;
}

export function effectivePermissions(user) {
  if (Array.isArray(user?.permissions) && user.permissions.length > 0) {
    return [...new Set(user.permissions)];
  }
  const names = Array.isArray(user?.roles) ? user.roles : [user?.role];
  const merged = new Set();
  names.forEach((n) => {
    const fallback = DEFAULT_ROLES.find(
      (d) => d.name === String(n || "").toUpperCase()
    );
    (fallback?.permissions || []).forEach((p) => merged.add(p));
  });
  return [...merged];
}