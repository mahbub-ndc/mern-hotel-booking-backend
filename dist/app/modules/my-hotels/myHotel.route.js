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
exports.myHotelRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const verifyToken_1 = __importDefault(require("../../middlware/verifyToken"));
const myHotel_model_1 = require("./myHotel.model");
const cloudinary_1 = require("cloudinary");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
});
router.post("/", verifyToken_1.default, upload.array("files", 6), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFiles = req.files;
        req.body = JSON.parse(req.body.data);
        const newHotel = req.body;
        console.log(newHotel);
        console.log(imageFiles);
        // Upload images to Cloudinary
        const uploadPromises = imageFiles.map((file) => cloudinary_1.v2.uploader.upload(file.path, {
            folder: "user_uploads", // Optional: organize uploads in a folder
        }));
        const uploadedImages = yield Promise.all(uploadPromises);
        // Format the image data for MongoDB
        const imageUrls = uploadedImages.map((image) => image.secure_url);
        newHotel.imageUrls = imageUrls;
        console.log(newHotel);
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;
        const createdHotel = yield myHotel_model_1.Hotel.create(newHotel);
        res.status(200).json({
            success: true,
            message: "Hotel created successfully",
            data: createdHotel,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create hotel",
            error: err,
        });
    }
}));
router.get("/", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield myHotel_model_1.Hotel.find();
        res.status(200).json({
            success: true,
            message: "Hotels fetched successfully",
            data: hotels,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch hotels",
            error: err,
        });
    }
}));
router.get("/:id", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id.toString();
    try {
        const hotel = yield myHotel_model_1.Hotel.findOne({ _id: id, userId: req.userId });
        // if (!hotel) {
        //   return res.status(404).json({
        //     success: false,
        //     message: "Hotel not found",
        //   });
        // }
        res.status(200).json({
            success: true,
            message: "Hotel fetched successfully",
            data: hotel,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch hotel",
            error: err,
        });
    }
}));
exports.myHotelRoutes = router;
