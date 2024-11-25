import express, { Request, Response } from "express";
import { User } from "../user/user.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import verifyToken from "../../middlware/verifyToken";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    //console.log(user);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User does not exist",
      });
      return;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      res.status(400).json({
        success: false,
        message: "Password does not match",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      config.jwt_secret as string,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in successfully",
      data: user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
    userId: req.userId,
  });
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

export const authRoutes = router;
