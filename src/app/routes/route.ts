import { authRoutes } from "../modules/auth/auth.route";
import { myHotelRoutes } from "../modules/my-hotels/myHotel.route";
import { UserRoutes } from "../modules/user/user.route";
import express from "express";
import { TestRoute } from "../test/test.route";

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
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
