import express, { Request, Response } from "express";

import validateRequest from "../../middlware/validateRequest";
import { UserValidation } from "./user.validation";
import { User } from "./user.model";
import verifyToken from "../../middlware/verifyToken";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(UserValidation.createUserZodSchema),

  async (req: Request, res: Response) => {
    try {
      const userData = req.body;

      const user = await User.findOne({ email: userData.email });

      if (user) {
        res.status(400).json({
          success: false,
          message: "User already exists",
        });
        return;
      }

      const result = await User.create(userData);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
        error,
      });
    }
  }
);

router.get("/get-user", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    res.status(200).json({
      message: "User found",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

export const UserRoutes = router;
