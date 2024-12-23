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
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlware/validateRequest"));
const user_validation_1 = require("./user.validation");
const user_model_1 = require("./user.model");
const verifyToken_1 = __importDefault(require("../../middlware/verifyToken"));
const router = express_1.default.Router();
router.post("/create-user", (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const user = yield user_model_1.User.findOne({ email: userData.email });
        if (user) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
            return;
        }
        const result = yield user_model_1.User.create(userData);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error,
        });
    }
}));
router.get("/get-user", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield user_model_1.User.findById(userId).select("-password");
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
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error,
        });
    }
}));
exports.UserRoutes = router;
