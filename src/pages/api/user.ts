import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookie from "cookie";

const prisma = new PrismaClient();

// Middleware for password encryption
prisma.$use(async (params, next) => {
  // Validation
  if (params.action == "create" && params.model == "User") {
    // Get user
    const user = params.args.data;

    // Generate salt string
    const salt = bcrypt.genSaltSync(10);

    // Generate hashed password
    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash;

    // Save changes
    params.args.data = user;
  }

  return next(params);
});

export type ReturnType = {
  success: boolean;
  user?: {
    email: string;
  };
  error?: any;
};

const maxAge = 7 * 24 * 60 * 60;

const createToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "", { expiresIn: maxAge });
};

const checkReqBody = (
  reqBody: any,
  checkFor: "user" | "profile",
  checkPassword: boolean = true
) => {
  const { user } = reqBody;

  switch (checkFor) {
    case "user":
      // Check if the request body has valid parameters required
      if (!("email" in user && "password" in user)) {
        const error = JSON.stringify({
          code: "INVALID_BODY",
          message: "Invalid request body",
        });

        throw new Error(error);
      }

      if (!validator.isEmail(user.email)) {
        const error = JSON.stringify({
          code: "INVALID_EMAIL",
          message: `Invalid email: ${user.email}`,
        });

        throw new Error(error);
      }

      if (checkPassword) {
        if (!validator.isStrongPassword(user.password)) {
          const error = JSON.stringify({
            code: "INVALID_PASSWORD",
            message: "Password is not strong enough",
          });

          throw new Error(error);
        }
      }
      break;

    case "profile":
      // TODO: Check if the request body has valid parameters required for profile

      break;
    default:
      throw new Error("Invalid parameter");
  }
};

const handleErrors = (err: any) => {
  let errors: any = {};

  // Duplicate error
  if (err.code === "P2002") {
    errors["duplicate_error"] = "This email already have an account";
    return errors;
  }

  const customError = JSON.parse(err.message);

  if (customError.code.includes("INVALID")) {
    errors[
      `${customError.code.slice(8).trim().toLowerCase()}_validation_error`
    ] = customError.message;
  }

  return errors;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>
) {
  const { user } = req.body;
  const { action } = req.query;

  try {
    // Execute different actions depending on the action
    switch (action) {
      case "register":
        checkReqBody(req.body, "user");

        // Register user
        const newUser = await prisma.user.create({
          data: { email: user.email, password: user.password },
        });

        // Create JWT token
        const token = createToken(newUser.id);

        // Send cookie to client
        res.setHeader(
          "Set-Cookie",
          // Create cookie
          cookie.serialize("jwt", token, {
            maxAge,
            httpOnly: true,
            sameSite: "strict",
            secure: true,
          })
        );

        res.status(201).json({ success: true, user: { email: newUser.email } });
        break;

      case "login":
        checkReqBody(req.body, "user", false);

        // Login
        break;

      case "logout":
        // Logout
        break;

      case "create-profile":
        // Create user profile
        break;

      case "update-profile":
        // Update profile
        break;

      case "delete-profile":
        // Delete profile
        break;

      default:
        res.status(400).json({ success: false, error: "Unknown action" });
        break;
    }
  } catch (error) {
    console.log(error);

    const errors = handleErrors(error);

    res.status(400).json({ success: false, error: errors });
  }
}
