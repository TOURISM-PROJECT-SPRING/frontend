# API Layer

Centralized HTTP client.

- `axiosClient.js` - Axios instance with base URL, JSON default header, bearer-token request interceptor

All endpoint calls live in `src/services/*` (one module per backend controller).

## Backend API coverage

| Controller | Frontend service | Base path |
|---|---|---|
| LocationController (provinces) | `provinceService.js` | `/locations` |
| LocationController (districts) | `districtService.js` | `/locations` |
| CartController | `cartService.js` | `/carts` |
| PlaceCategoryController | `placeCategoryService.js` | `/place-categories` |
| FoodCategoryController | `foodCategoryService.js` | `/food-categories` |
| HotelController | `hotelService.js` | `/hotels` |
| RoomTypeController | `roomTypeService.js` | `/room-types` |
| RoomController | `roomService.js` | `/rooms` |
| HotelRoomController | `hotelRoomService.js` | `/hotel-rooms` |
| RoomBookingController | `roomBookingService.js` | `/room-bookings` |
| TourPlaceController | `tourPlaceService.js` | `/tour-places` |
| TourPlaceAttachmentController | `tourPlaceService.js` | `/tour-place-attachments` |
| RestaurantController | `restaurantService.js` | `/restaurants` |
| FoodController | `foodService.js` | `/foods` |
| FoodOrderController | `orderService.js` | `/food-orders` |
| TicketController | `ticketService.js` | `/tickets` |
| TicketBookingController | `ticketBookingService.js` | `/ticket-bookings` |
| ETicketController | `ticketBookingService.js` | `/ticket-bookings/{id}/eticket` |
| PaymentController | `paymentService.js` | `/ticket-bookings/{id}/payment`, `/payments/*` |
| UserAttachmentController | `userAttachmentService.js` | `/users/{userId}/attachments` |
| HotelAttachmentController | `hotelAttachmentService.js` | `/hotels/{hotelId}/attachments` |
| RoomAttachmentController | `roomAttachmentService.js` | `/rooms/{roomId}/attachments` |
| FoodAttachmentController | `foodAttachmentService.js` | `/foods/{foodId}/attachments` |
| RestaurantAttachmentController | `restaurantAttachmentService.js` | `/restaurants/{restaurantId}/attachments` |
| ImageController | `imageService.js` | `/v1/files/upload` |