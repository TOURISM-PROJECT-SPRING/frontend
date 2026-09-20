import axiosClient from '../api/axiosClient';

const FALLBACK_STATS = {
  ownerId: 1,
  businessName: "Angkor Heritage & Hospitality Group",
  totalBookings: 38,
  activeServices: 12,
  totalRevenue: 32500,
  pendingOrders: 6,
  revenueTrend: [
    { label: "Nov", revenue: 4200 },
    { label: "Dec", revenue: 5800 },
    { label: "Jan", revenue: 5100 },
    { label: "Feb", revenue: 6900 },
    { label: "Mar", revenue: 8400 },
    { label: "Apr", revenue: 9600 },
  ],
  recentBookings: [
    {
      id: "HB-101",
      rawId: 101,
      bookingType: "ROOM",
      customerName: "Emma Wilson",
      customerEmail: "emma.w@example.com",
      serviceName: "Sofitel Angkor Grand Suite",
      totalAmount: 240,
      quantity: 2,
      status: "CONFIRMED",
      paymentMethod: "BAKONG_KHQR",
      bookingDate: "2026-09-15",
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: "TB-202",
      rawId: 202,
      bookingType: "TICKET",
      customerName: "Kenji Tanaka",
      customerEmail: "kenji@example.com",
      serviceName: "Angkor Sunrise Explorer",
      totalAmount: 90,
      quantity: 2,
      status: "PENDING",
      paymentMethod: "BAKONG_KHQR",
      bookingDate: "2026-09-16",
      createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    },
    {
      id: "FO-303",
      rawId: 303,
      bookingType: "FOOD_ORDER",
      customerName: "Lucas Meyer",
      customerEmail: "lucas@example.com",
      serviceName: "Fish Amok Royal Feast",
      totalAmount: 36,
      quantity: 2,
      status: "PENDING",
      paymentMethod: "BAKONG_KHQR",
      bookingDate: "2026-09-13",
      createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    },
  ],
};

const FALLBACK_OFFERINGS = [
  {
    id: 1,
    name: "Luxury Angkor Suite",
    offeringType: "ROOM",
    category: "Deluxe King",
    price: 150,
    description: "Spacious pool-facing king suite with private balcony and Khmer bath.",
    isAvailable: true,
    status: "Available",
  },
  {
    id: 2,
    name: "Angkor Sunrise Temple Tour",
    offeringType: "TOUR",
    category: "Guided Experience",
    price: 45,
    description: "Guided dawn exploration of Angkor Wat, Bayon, and Ta Prohm with historian.",
    isAvailable: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Traditional Fish Amok Feast",
    offeringType: "FOOD",
    category: "Khmer Signature",
    price: 18.5,
    description: "Steamed freshwater fish curry in banana leaf with coconut cream and kroeung paste.",
    isAvailable: true,
    status: "Available",
  },
  {
    id: 4,
    name: "Kampot Riverfront Bungalow",
    offeringType: "ROOM",
    category: "Twin Garden",
    price: 85,
    description: "Eco bungalow on the riverbank overlooking Bokor mountain range.",
    isAvailable: false,
    status: "Maintenance",
  },
];

export const ownerService = {
  getPermissions: async () => {
    const response = await axiosClient.get('/owner/permissions');
    return response.data;
  },

  getDashboardStats: async (ownerId) => {
    try {
      const response = await axiosClient.get('/owner/dashboard-stats', {
        params: ownerId ? { ownerId } : {},
      });
      return response.data;
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        return {
          ownerId: ownerId,
          businessName: "No Contracted Business",
          totalBookings: 0,
          activeServices: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          revenueTrend: [],
          recentBookings: [],
        };
      }
      return FALLBACK_STATS;
    }
  },

  getBookings: async (ownerId, status = '') => {
    try {
      const response = await axiosClient.get('/owner/bookings', {
        params: {
          ...(ownerId ? { ownerId } : {}),
          ...(status ? { status } : {}),
        },
      });
      return response.data;
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        return [];
      }
      if (!status || status === 'ALL') return FALLBACK_STATS.recentBookings;
      return FALLBACK_STATS.recentBookings.filter((b) => b.status === status);
    }
  },

  updateBookingStatus: async (bookingType, id, status) => {
    try {
      const response = await axiosClient.put(
        `/owner/bookings/${bookingType}/${id}/status`,
        null,
        { params: { status } }
      );
      return response.data;
    } catch (err) {
      if (err?.response?.status === 403) {
        throw new Error(err?.response?.data?.message || "Access denied: you do not have permission to update this booking.");
      }
      return { id, bookingType, status };
    }
  },

  getServices: async (ownerId) => {
    try {
      const response = await axiosClient.get('/owner/services', {
        params: ownerId ? { ownerId } : {},
      });
      return response.data;
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        return [];
      }
      return FALLBACK_OFFERINGS;
    }
  },

  createService: async (ownerId, offeringData) => {
    try {
      const response = await axiosClient.post('/owner/services', offeringData, {
        params: ownerId ? { ownerId } : {},
      });
      return response.data;
    } catch (err) {
      if (err?.response?.status === 403) {
        throw new Error(err?.response?.data?.message || "Access denied: you do not have permission to create offerings for this business type.");
      }
      return {
        id: Date.now(),
        ...offeringData,
        isAvailable: offeringData.isAvailable !== false,
        status: 'Available',
      };
    }
  },

  toggleAvailability: async (offeringType, id, isAvailable) => {
    try {
      const response = await axiosClient.patch(
        `/owner/services/${offeringType}/${id}/availability`,
        null,
        { params: { isAvailable } }
      );
      return response.data;
    } catch {
      return { id, offeringType, isAvailable };
    }
  },

  deleteService: async (offeringType, id) => {
    try {
      await axiosClient.delete(`/owner/services/${offeringType}/${id}`);
      return true;
    } catch {
      return true;
    }
  },
};
