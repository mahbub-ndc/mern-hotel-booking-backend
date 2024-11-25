import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: JwtPayload;
    }
  }
}

const verifyToken = (req: any, res: any, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({
      message: "Token is missing",
    });
    return;
  }

  const decoded = jwt.verify(token, config.jwt_secret as string);
  req.userId = (decoded as JwtPayload).userId;
  //console.log(req.userId);

  next();
};
export default verifyToken;