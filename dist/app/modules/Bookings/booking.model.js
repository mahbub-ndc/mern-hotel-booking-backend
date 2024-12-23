"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.bookingSchema = new mongoose_1.default.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    adultCount: { type: Number },
    childCount: { type: Number },
    checkIn: { type: Date },
    checkOut: { type: Date },
    userId: { type: String },
    totalCost: { type: Number },
});
