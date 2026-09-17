# Services Layer

Business-logic modules over the backend API. Components call services, not the HTTP client directly.
One service per backend controller — see `src/api/README.md` for the full coverage map.

- `cartService.js` - Cart & cart items
- `provinceService.js` - Provinces (LocationController)
- `districtService.js` - Districts (LocationController)
- `placeCategoryService.js` - Place categories (multipart image upload)
- `foodCategoryService.js` - Food categories
- `hotelService.js` - Hotels
- `roomTypeService.js` - Room types
- `roomService.js` - Rooms
- `hotelRoomService.js` - Hotel rooms (price range / min capacity filters)
- `roomBookingService.js` - Room bookings
- `tourPlaceService.js` - Tour places (multipart image array, status/rating filters, attachments)
- `restaurantService.js` - Restaurants
- `foodService.js` - Foods (multipart image upload)
- `orderService.js` - Food orders (place order, from-cart, status updates, cancel)
- `ticketService.js` - Tickets (available, by-place, price range)
- `ticketBookingService.js` - Ticket bookings (cancel, mark-used, verify QR, ETicket PDF download)
- `paymentService.js` - Payments (initiate, callbacks)
- `profileService.js` - Admin profile read (`GET /management/users/{id}`) + password change (`POST /auth/change-password`)
- `imageService.js` - File upload to Cloudinary
- `userAttachmentService.js` - User attachments (profile/cover images)
- `hotelAttachmentService.js` - Hotel attachments
- `roomAttachmentService.js` - Room attachments
- `foodAttachmentService.js` - Food attachments
- `restaurantAttachmentService.js` - Restaurant attachments
- `settingsService.js` - Admin settings persistence (localStorage; backend endpoint TBD)

Notes:

- Multipart endpoints pass `'Content-Type': undefined` so axios does not JSON-serialize `FormData`.
- Auth token is attached automatically by the `axiosClient.js` request interceptor.
- `ticketBookingService.downloadETicket` uses `responseType: 'blob'` for the PDF download.