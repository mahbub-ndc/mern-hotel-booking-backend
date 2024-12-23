"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyHotelValidation = void 0;
const zod_1 = require("zod");
const createHotelZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        description: zod_1.z.string({
            required_error: "Description is required",
        }),
        city: zod_1.z.string({
            required_error: "City is required",
        }),
        Country: zod_1.z.string({
            required_error: "Country is required",
        }),
        type: zod_1.z.string({
            required_error: "Hotel type is required",
        }),
        pricePerNight: zod_1.z.number({
            required_error: "Price per night is required",
        }),
        facilities: zod_1.z.array(zod_1.z.string({
            required_error: "Facilities are required",
        })),
    }),
});
exports.MyHotelValidation = {
    createHotelZodSchema,
};
