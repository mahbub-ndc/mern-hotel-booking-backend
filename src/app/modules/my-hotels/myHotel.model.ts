import mongoose from "mongoose";
import { HotelType } from "./myHotel.interface";
import { bookingSchema } from "../Bookings/booking.model";

const hotelSchema = new mongoose.Schema<HotelType>({
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
  bookings: [bookingSchema],
});

export const Hotel = mongoose.model<HotelType>("MyHotel", hotelSchema);
