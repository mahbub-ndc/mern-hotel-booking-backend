"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-namespace */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    // console.log("token", token);
    if (!token) {
        res.status(401).json({
            message: "Token is missing",
        });
        return;
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
    req.userId = decoded.userId;
    //console.log(req.userId);
    next();
};
exports.default = verifyToken;
