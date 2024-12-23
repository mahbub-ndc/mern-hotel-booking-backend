"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myBookingsRoute = void 0;
const express_1 = __importDefault(require("express"));
const myHotel_model_1 = require("../my-hotels/myHotel.model");
const verifyToken_1 = __importDefault(require("../../middlware/verifyToken"));
const router = express_1.default.Router();
router.get("/", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield myHotel_model_1.Hotel.find({
            bookings: {
                $elemMatch: { userId: req.userId },
            },
        });
        //console.log(req.userId);
        const results = hotels.map((hotel) => {
            const userBooking = hotel.bookings.filter((booking) => { var _a; return booking.userId === ((_a = req.userId) === null || _a === void 0 ? void 0 : _a.toString()); });
            const userBookings = Object.assign(Object.assign({}, hotel.toObject()), { bookings: userBooking });
            return userBookings;
        });
        res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: results,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error,
        });
    }
}));
exports.myBookingsRoute = router;
