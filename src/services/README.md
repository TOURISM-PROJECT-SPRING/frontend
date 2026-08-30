# Services Layer

Business-logic modules over the backend API. Components call services, not the HTTP client directly.
One service per backend controller — see `src/api/README.md` for the full coverage map.

- `cartService.js` - Cart & cart items
- `provinceService.js` - Provinces (multipart image upload)
- `districtService.js` - Districts
- `placeCategoryService.js` - Place categories (multipart image upload)
- `foodCategoryService.js` - Food categories
- `hotelService.js` - Hotels
- `roomTypeService.js` - Room types
- `roomService.js` - Rooms
- `hotelRoomService.js` - Hotel rooms (price range / min capacity filters)
- `roomBookingService.js` - Room bookings
- `tourPlaceService.js` - Tour places (multipart image array, status/rating filters)
- `restaurantService.js` - Restaurants
- `foodService.js` - Foods (multipart image upload)
- `orderService.js` - Food orders (place order, from-cart, status updates, cancel)
- `imageService.js` - File upload to Cloudinary

Notes:

- Multipart endpoints pass `'Content-Type': undefined` so axios does not JSON-serialize `FormData`.
- Auth token is attached automatically by the `axiosClient.js` request interceptor.