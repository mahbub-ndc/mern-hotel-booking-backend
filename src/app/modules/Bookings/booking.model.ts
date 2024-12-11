import mongoose from "mongoose";
import { BookingType } from "./booking.interface";

export const bookingSchema = new mongoose.Schema<BookingType>({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  adultCount: { type: Number },
  childCount: { type: Number },
  checkIn: { type: Date },
  checkOut: { type: Date },
  userId: { type: String },
  totalCost: { type: Number },
});
