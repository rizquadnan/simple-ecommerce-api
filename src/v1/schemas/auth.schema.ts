import { Prisma, user_type, users } from "@prisma/client";
import { TypeOf, object, string, z } from "zod";

export const registerUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
    contactNumber: string({
      required_error: "Contact number is required",
    }),
    contactNumberExtension: string({
      required_error: "Contact number extension is required",
    }),
    password: string({
      required_error: "Password is required",
    })
      .min(6, "Password must be more than 6 characters")
      .max(32, "Password must be less than 32 characters"),
    role: z.nativeEnum(user_type),
  }),
});

export type RegisterUserBody = TypeOf<typeof registerUserSchema>["body"];

export const verifyEmailSchema = object({
  params: object({
    emailVerificationCode: string(),
  }),
});

export type VerifyEmailParams = TypeOf<typeof verifyEmailSchema>["params"];

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Invalid email or password"),
  }),
});

export type LoginUserBody = TypeOf<typeof loginUserSchema>["body"];

export const userSensitiveExcludedFields = [
  "password",
  "email_verified",
  "email_verification_code",
  "deleted",
];

export type UserSanitized = Omit<
  users,
  "password" | "email_verified" | "email_verification_code" | "deleted"
>;
