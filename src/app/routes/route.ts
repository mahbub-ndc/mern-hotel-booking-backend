import { authRoutes } from "../modules/auth/auth.route";
import { myHotelRoutes } from "../modules/my-hotels/myHotel.route";
import { UserRoutes } from "../modules/user/user.route";
import express from "express";
import { TestRoute } from "../test/test.route";
import { HotelRoute } from "../modules/hotels/hotel.route";
import { myBookingsRoute } from "../modules/Bookings/myBookings.route";

const router = express.Router();

const routes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/hotels",
    route: myHotelRoutes,
  },

  {
    path: "/test",
    route: TestRoute,
  },
  {
    path: "/hotel-list",
    route: HotelRoute,
  },
  {
    path: "/my-bookings",
    route: myBookingsRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
