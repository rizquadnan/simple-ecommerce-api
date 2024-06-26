import { Router } from "express";
import {
  loginUserHandler,
  logoutUserHandler,
  registerUserHandler,
  verifyEmailHandler,
} from "../controllers/auth.controller";
import { validate } from "../../middlewares/validate";
import {
  loginUserSchema,
  registerUserSchema,
  verifyEmailSchema,
} from "../schemas/auth.schema";

const router = Router();

router.post("/register", validate(registerUserSchema), registerUserHandler);

router.get(
  "/verify_email/:emailVerificationCode",
  validate(verifyEmailSchema),
  verifyEmailHandler
);

router.post("/login", validate(loginUserSchema), loginUserHandler);

router.post("/logout", logoutUserHandler);

export default router;
