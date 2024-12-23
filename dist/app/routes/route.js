"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = require("../modules/auth/auth.route");
const myHotel_route_1 = require("../modules/my-hotels/myHotel.route");
const user_route_1 = require("../modules/user/user.route");
const express_1 = __importDefault(require("express"));
const hotel_route_1 = require("../modules/hotels/hotel.route");
const myBookings_route_1 = require("../modules/Bookings/myBookings.route");
const router = express_1.default.Router();
const routes = [
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/hotels",
        route: myHotel_route_1.myHotelRoutes,
    },
    {
        path: "/hotel-list",
        route: hotel_route_1.HotelRoute,
    },
    {
        path: "/my-bookings",
        route: myBookings_route_1.myBookingsRoute,
    },
];
routes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
