"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hotel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const booking_model_1 = require("../Bookings/booking.model");
const hotelSchema = new mongoose_1.default.Schema({
    userId: { type: String },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String },
    adultCount: { type: Number },
    childCount: { type: Number },
    facilities: [{ type: String }],
    pricePerNight: { type: Number, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    imageUrls: [String],
    lastUpdated: { type: Date },
    bookings: [booking_model_1.bookingSchema],
});
exports.Hotel = mongoose_1.default.model("MyHotel", hotelSchema);
