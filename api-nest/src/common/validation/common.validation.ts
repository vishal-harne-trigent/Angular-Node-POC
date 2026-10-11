import { z } from "zod";

export const userStatusSchema = z.enum(["active", "inactive"], {
    message: "Status must be active or inactive",
});

export const userRoleSchema = z.enum(["employee", "admin"], {
    message: "Role must be Employee or Admin",
});

export const emailSchema = z
    .string({ message: "Email is required" })
    .email("Invalid email format");

export const passwordSchema = z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters");

export const nameSchema = z
    .string({ message: "Name is required" })
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters");

export const phoneNumberSchema = z
    .string()
    .max(20, "Phone number must be at most 20 characters")
    .optional();

export const idParamSchema = z.object({
    id: z.coerce
        .number({ message: "Invalid user id" })
        .int("Invalid user id")
        .positive("Invalid user id"),
});
