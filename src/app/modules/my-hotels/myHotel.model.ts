import mongoose from "mongoose";
import { HotelType } from "./myHotel.interface";

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
  imageUrls: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
  lastUpdated: { type: Date },
});

export const Hotel = mongoose.model<HotelType>("MyHotel", hotelSchema);
