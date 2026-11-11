import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters").max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

const optionalUrlSchema = z
  .string()
  .trim()
  .url("Photo URL must be a valid URL")
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  }, "Photo URL must use HTTP or HTTPS");

export const reportSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(120, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(10, "Description is too short")
    .max(5000, "Description is too long"),
  photoUrl: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    optionalUrlSchema.optional(),
  ),
  categoryId: z.string().trim().min(1, "Category is required"),
  locationId: z.string().trim().min(1, "Location is required"),
});