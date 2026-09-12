import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { roomBookingService } from "../services/roomBookingService";
import { ticketBookingService } from "../services/ticketBookingService";

const INBOX_READ_KEY = "smart_tourism_inbox_read_ids";
const LOCAL_ALERTS_KEY = "smart_tourism_inbox_local_alerts";

const InboxContext = createContext(null);

export function InboxProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [toastAlert, setToastAlert] = useState(null);

  // Helper to read read IDs from localStorage
  const getReadIds = useCallback(() => {
    try {
      const raw = localStorage.getItem(INBOX_READ_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const saveReadId = useCallback((id) => {
    try {
      const current = getReadIds();
      if (!current.includes(id)) {
        const next = [...current, id];
        localStorage.setItem(INBOX_READ_KEY, JSON.stringify(next));
      }
    } catch (e) {
      console.error("Failed to save read alert ID:", e);
    }
  }, [getReadIds]);

  // Helper to read local alerts
  const getLocalAlerts = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_ALERTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const saveLocalAlert = useCallback((alert) => {
    try {
      const current = getLocalAlerts();
      const filtered = current.filter((a) => a.id !== alert.id);
      const next = [alert, ...filtered].slice(0, 50);
      localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save local alert:", e);
    }
  }, [getLocalAlerts]);

  // Fetch bookings and assemble alert list
  const loadAlerts = useCallback(async () => {
    setLoading(true);
    const readIds = getReadIds();
    const localAlerts = getLocalAlerts();
    const loadedList = [...localAlerts];

    if (isAuthenticated && user?.id) {
      try {
        const [roomBookings, ticketBookings] = await Promise.all([
          roomBookingService.getRoomBookingsByUser(user.id).catch(() => []),
          ticketBookingService.getTicketBookingsByUser(user.id).catch(() => []),
        ]);

        // Convert room bookings to inbox alerts
        (roomBookings || []).forEach((b) => {
          const alertId = `room-booking-${b.id}`;
          const isRead = readIds.includes(alertId);
          loadedList.push({
            id: alertId,
            type: "hotel_booking",
            title: `🎉 Hotel Stay Confirmed: ${b.hotelName || "Hotel Booking"}`,
            subtitle: `${b.roomType || "Standard Room"} • ${b.numGuest || 1} Guests`,
            message: `Your reservation at ${b.hotelName || "the hotel"} from ${b.checkIn} to ${b.checkOut} has been confirmed.`,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            amount: b.amount,
            pricePerNight: b.pricePerNight,
            hotelName: b.hotelName,
            roomType: b.roomType,
            numGuest: b.numGuest,
            status: b.status || "CONFIRMED",
            paymentMethod: b.paymentMethod || "Cash on Arrival",
            referenceNo: `RB-${String(b.id).padStart(5, "0")}`,
            bookingData: b,
            timestamp: b.createdAt || new Date().toISOString(),
            isRead: isRead,
          });
        });

        // Convert ticket bookings to inbox alerts
        (ticketBookings || []).forEach((tb) => {
          const alertId = `ticket-booking-${tb.id}`;
          const isRead = readIds.includes(alertId);
          loadedList.push({
            id: alertId,
            type: "ticket_booking",
            title: `🎫 Tour Experience Confirmed: ${tb.ticketName || tb.tourismPlaceName || "Experience"}`,
            subtitle: `${tb.tourismPlaceName || "Cambodia Destination"} • ${tb.quantity || 1} Tickets`,
            message: `Your booking for ${tb.ticketName || "the experience"} on ${tb.visitDate || "scheduled date"} is confirmed.`,
            visitDate: tb.visitDate,
            amount: tb.totalPrice,
            ticketName: tb.ticketName,
            tourismPlaceName: tb.tourismPlaceName,
            quantity: tb.quantity,
            status: tb.status || "CONFIRMED",
            paymentMethod: tb.paymentMethod || "Credit Card",
            referenceNo: `TB-${String(tb.id).padStart(5, "0")}`,
            bookingData: tb,
            timestamp: tb.createdAt || new Date().toISOString(),
            isRead: isRead,
          });
        });
      } catch (err) {
        console.error("Error loading user bookings for inbox:", err);
      }
    }

    // Deduplicate by ID
    const uniqueMap = new Map();
    loadedList.forEach((item) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    // Sort by timestamp descending
    const sorted = Array.from(uniqueMap.values()).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setAlerts(sorted);
    setLoading(false);
  }, [isAuthenticated, user?.id, getReadIds, getLocalAlerts]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Add a new booking alert immediately
  const addBookingAlert = useCallback(
    (booking, type = "hotel_booking") => {
      const isHotel = type === "hotel_booking";
      const alertId = isHotel ? `room-booking-${booking.id || Date.now()}` : `ticket-booking-${booking.id || Date.now()}`;
      
      const newAlert = {
        id: alertId,
        type: type,
        title: isHotel
          ? `🎉 Hotel Stay Confirmed: ${booking.hotelName || "Hotel Booking"}`
          : `🎫 Tour Confirmed: ${booking.ticketName || booking.tourismPlaceName || "Experience"}`,
        subtitle: isHotel
          ? `${booking.roomType || "Room"} • ${booking.numGuest || 1} Guests`
          : `${booking.tourismPlaceName || "Tour"} • ${booking.quantity || 1} Tickets`,
        message: isHotel
          ? `Your stay at ${booking.hotelName || "hotel"} from ${booking.checkIn} to ${booking.checkOut} has been confirmed.`
          : `Your experience on ${booking.visitDate} is booked and ready.`,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        visitDate: booking.visitDate,
        amount: booking.amount || booking.totalPrice,
        pricePerNight: booking.pricePerNight,
        hotelName: booking.hotelName,
        roomType: booking.roomType,
        numGuest: booking.numGuest,
        status: booking.status || "CONFIRMED",
        paymentMethod: booking.paymentMethod || "Cash on Arrival",
        referenceNo: isHotel ? `RB-${String(booking.id || Date.now()).slice(-5)}` : `TB-${String(booking.id || Date.now()).slice(-5)}`,
        bookingData: booking,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      saveLocalAlert(newAlert);

      setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)]);

      // Trigger floating toast
      setToastAlert(newAlert);
      setTimeout(() => {
        setToastAlert(null);
      }, 7000);

      return newAlert;
    },
    [saveLocalAlert]
  );

  const markAsRead = useCallback(
    (id) => {
      saveReadId(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
      );
    },
    [saveReadId]
  );

  const markAllAsRead = useCallback(() => {
    alerts.forEach((a) => saveReadId(a.id));
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  }, [alerts, saveReadId]);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    try {
      const current = getLocalAlerts().filter((a) => a.id !== id);
      localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(current));
    } catch {}
  }, [getLocalAlerts]);

  const clearAllAlerts = useCallback(() => {
    alerts.forEach((a) => saveReadId(a.id));
    setAlerts([]);
    localStorage.removeItem(LOCAL_ALERTS_KEY);
  }, [alerts, saveReadId]);

  const openInbox = useCallback(() => setIsOpen(true), []);
  const closeInbox = useCallback(() => setIsOpen(false), []);
  const toggleInbox = useCallback(() => setIsOpen((prev) => !prev), []);

  const viewBookingDetails = useCallback((alertOrBooking) => {
    const booking = alertOrBooking.bookingData || alertOrBooking;
    setSelectedBooking(booking);
    if (alertOrBooking.id) {
      markAsRead(alertOrBooking.id);
    }
  }, [markAsRead]);

  const closeBookingDetails = useCallback(() => {
    setSelectedBooking(null);
  }, []);

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <InboxContext.Provider
      value={{
        alerts,
        unreadCount,
        loading,
        isOpen,
        selectedBooking,
        toastAlert,
        openInbox,
        closeInbox,
        toggleInbox,
        markAsRead,
        markAllAsRead,
        removeAlert,
        clearAllAlerts,
        addBookingAlert,
        viewBookingDetails,
        closeBookingDetails,
        refreshAlerts: loadAlerts,
        setToastAlert,
      }}
    >
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const ctx = useContext(InboxContext);
  if (!ctx) throw new Error("useInbox must be used within an InboxProvider");
  return ctx;
}
