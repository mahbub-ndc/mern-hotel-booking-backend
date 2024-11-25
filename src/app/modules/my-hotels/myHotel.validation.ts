import { z } from "zod";
const createHotelZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    city: z.string({
      required_error: "City is required",
    }),
    Country: z.string({
      required_error: "Country is required",
    }),
    type: z.string({
      required_error: "Hotel type is required",
    }),
    pricePerNight: z.number({
      required_error: "Price per night is required",
    }),
    facilities: z.array(
      z.string({
        required_error: "Facilities are required",
      })
    ),
  }),
});
export const MyHotelValidation = {
  createHotelZodSchema,
};
