import { BookingType } from "../Bookings/booking.interface";

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  rating: number;
  imageUrls: string[];
  lastUpdated: Date;
  bookings: BookingType[];
};
