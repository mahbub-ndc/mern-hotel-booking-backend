import express, { Request, Response } from "express";
import { Hotel } from "../my-hotels/myHotel.model";
import verifyToken from "../../middlware/verifyToken";

const router = express.Router();
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      bookings: {
        $elemMatch: { userId: req.userId },
      },
    });
    //console.log(req.userId);

    const results = hotels.map((hotel) => {
      const userBooking = hotel.bookings.filter(
        (booking) => booking.userId === req.userId?.toString()
      );

      const userBookings = {
        ...hotel.toObject(),
        bookings: userBooking,
      };
      return userBookings;
    });
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
});

export const myBookingsRoute = router;
