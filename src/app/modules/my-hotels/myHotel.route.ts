import express, { Request, Response } from "express";
import multer from "multer";
import verifyToken from "../../middlware/verifyToken";

import { HotelType } from "./myHotel.interface";
import { Hotel } from "./myHotel.model";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
});

router.post(
  "/",
  verifyToken,
  upload.array("files", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      req.body = JSON.parse(req.body.data);
      const newHotel: HotelType = req.body;
      console.log(newHotel);
      console.log(imageFiles);

      // Upload images to Cloudinary

      const uploadPromises = imageFiles.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "user_uploads", // Optional: organize uploads in a folder
        })
      );

      const uploadedImages = await Promise.all(uploadPromises);

      // Format the image data for MongoDB
      const imageUrls = uploadedImages.map((image) => image.secure_url);

      newHotel.imageUrls = imageUrls;

      console.log(newHotel);

      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId as unknown as string;

      const createdHotel = await Hotel.create(newHotel);

      res.status(200).json({
        success: true,
        message: "Hotel created successfully",
        data: createdHotel,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to create hotel",
        error: err,
      });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({
      success: true,
      message: "Hotels fetched successfully",
      data: hotels,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
      error: err,
    });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({ _id: id, userId: req.userId });
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotel",
      error: err,
    });
  }
});

export const myHotelRoutes = router;
