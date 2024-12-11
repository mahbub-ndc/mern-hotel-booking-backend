import express, { Request, Response } from "express";
import { Hotel } from "../my-hotels/myHotel.model";
import Stripe from "stripe";
import verifyToken from "../../middlware/verifyToken";
import { BookingType } from "../Bookings/booking.interface";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const router = express.Router();
router.get("/search", async (req, res) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 2;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;
    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    const total = await Hotel.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);
    res.status(200).json({
      success: true,
      message: "Hotels fetched successfully",
      data: hotels,
      total,
      totalPages,
      currentPage: pageNumber,
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

router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Hotel fetched successfully",
      data: hotel,
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

router.post(
  "/:id/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.id;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
    }

    const totalCost = hotel?.pricePerNight! * numberOfNights;

    console.log("total", totalCost);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100, // Convert to cents
      currency: "usd",
      metadata: {
        hotelId,
        userId: req.userId as unknown as string,
      },
    });

    if (!paymentIntent.client_secret) {
      res.status(500).json({ message: "Error creating payment intent" });
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret?.toString(),
      totalCost,
    };

    res.status(200).json({
      success: true,
      message: "Payment intent created successfully",
      data: response,
    });
  }
);

router.post("/:hotelId/booking", verifyToken, async (req, res) => {
  try {
    const paymentIntentId = req.body.paymentIntentId;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent) {
      res.status(400).json({
        success: false,
        message: "Payment intent not found",
      });
    }
    const newBooking: BookingType = {
      ...req.body,
      userId: req.userId as unknown as string,
    };
    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId },
      { $push: { bookings: newBooking } },
      { new: true }
    );
    await hotel?.save();
    res.status(200).json({
      success: true,
      message: "Booking created successfully",
      data: hotel,
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

router.get("/", async (req, res) => {
  try {
    const hotel = await Hotel.find().sort("-lastUpdated");
    res.status(200).json({
      success: true,
      message: "Hotel fectched Successfully!",
      data: hotel,
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

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export const HotelRoute = router;
