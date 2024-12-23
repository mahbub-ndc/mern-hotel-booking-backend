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
exports.HotelRoute = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
const express_1 = __importDefault(require("express"));
const myHotel_model_1 = require("../my-hotels/myHotel.model");
const stripe_1 = __importDefault(require("stripe"));
const verifyToken_1 = __importDefault(require("../../middlware/verifyToken"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const router = express_1.default.Router();
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const pageSize = 3;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = yield myHotel_model_1.Hotel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);
        const total = yield myHotel_model_1.Hotel.countDocuments(query);
        const totalPages = Math.ceil(total / pageSize);
        res.status(200).json({
            success: true,
            message: "Hotels fetched successfully",
            data: hotels,
            total,
            totalPages,
            currentPage: pageNumber,
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
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotel = yield myHotel_model_1.Hotel.findById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Hotel fetched successfully",
            data: hotel,
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
router.post("/:id/bookings/payment-intent", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { numberOfNights } = req.body;
    const hotelId = req.params.id;
    const hotel = yield myHotel_model_1.Hotel.findById(hotelId);
    if (!hotel) {
        res.status(404).json({ message: "Hotel not found" });
    }
    const totalCost = (hotel === null || hotel === void 0 ? void 0 : hotel.pricePerNight) * numberOfNights;
    console.log("total", totalCost);
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: totalCost * 100, // Convert to cents
        currency: "usd",
        metadata: {
            hotelId,
            userId: req.userId,
        },
    });
    if (!paymentIntent.client_secret) {
        res.status(500).json({ message: "Error creating payment intent" });
    }
    const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: (_a = paymentIntent.client_secret) === null || _a === void 0 ? void 0 : _a.toString(),
        totalCost,
    };
    res.status(200).json({
        success: true,
        message: "Payment intent created successfully",
        data: response,
    });
}));
router.post("/:hotelId/booking", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntentId = req.body.paymentIntentId;
        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
        if (!paymentIntent) {
            res.status(400).json({
                success: false,
                message: "Payment intent not found",
            });
        }
        const newBooking = Object.assign(Object.assign({}, req.body), { userId: req.userId });
        const hotel = yield myHotel_model_1.Hotel.findOneAndUpdate({ _id: req.params.hotelId }, { $push: { bookings: newBooking } }, { new: true });
        yield (hotel === null || hotel === void 0 ? void 0 : hotel.save());
        res.status(200).json({
            success: true,
            message: "Booking created successfully",
            data: hotel,
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
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotel = yield myHotel_model_1.Hotel.find().sort("-lastUpdated");
        res.status(200).json({
            success: true,
            message: "Hotel fectched Successfully!",
            data: hotel,
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
const constructSearchQuery = (queryParams) => {
    const constructedQuery = {};
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
        constructedQuery.stars = {
            $in: Array.isArray(queryParams.stars)
                ? queryParams.stars
                : [queryParams.stars],
        };
    }
    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }
    return constructedQuery;
};
exports.HotelRoute = router;
