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
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_model_1 = require("../user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const verifyToken_1 = __importDefault(require("../../middlware/verifyToken"));
const router = express_1.default.Router();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        //console.log(user);
        if (!user) {
            res.status(400).json({
                success: false,
                message: "User does not exist",
            });
            return;
        }
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(400).json({
                success: false,
                message: "Password does not match",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            email: user.email,
        }, config_1.default.jwt_secret, {
            expiresIn: "1d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        console.log(token);
        res.status(200).json({
            message: "User logged in successfully",
            data: user,
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error,
        });
    }
}));
router.get("/validate-token", verifyToken_1.default, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Token is valid",
        userId: req.userId,
    });
});
router.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token", {
            expires: new Date(0),
            // httpOnly: true,
            //secure: process.env.NODE_ENV === "production",
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            message: "User logged out successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error,
        });
    }
}));
exports.authRoutes = router;
