# API Layer

Centralized HTTP client.

- `axiosClient.js` - Axios instance with base URL, JSON default header, bearer-token request interceptor

All endpoint calls live in `src/services/*` (one module per backend controller).

## Backend API coverage

| Controller | Frontend service | Base path |
|---|---|---|
| CartController | `cartService.js` | `/carts` |
| ProvinceController | `provinceService.js` | `/provinces` |
| DistrictController | `districtService.js` | `/districts` |
| PlaceCategoryController | `placeCategoryService.js` | `/place-categories` |
| FoodCategoryController | `foodCategoryService.js` | `/food-categories` |
| HotelController | `hotelService.js` | `/hotels` |
| RoomTypeController | `roomTypeService.js` | `/room-types` |
| RoomController | `roomService.js` | `/rooms` |
| HotelRoomController | `hotelRoomService.js` | `/hotel-rooms` |
| RoomBookingController | `roomBookingService.js` | `/room-bookings` |
| TourPlaceController | `tourPlaceService.js` | `/tour-places` |
| RestaurantController | `restaurantService.js` | `/restaurants` |
| FoodController | `foodService.js` | `/foods` |
| FoodOrderController | `orderService.js` | `/food-orders` |
| ImageController | `imageService.js` | `/v1/files/upload` |