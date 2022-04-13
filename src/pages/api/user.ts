import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookie, { CookieSerializeOptions } from "cookie";

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

interface IError {
  code: string;
  message: string;
}

export type ResponseType = {
  success: boolean;
  user?: {
    email: string;
  };
  error?: IError[];
};

// 7 days
const maxAge = 7 * 24 * 60 * 60;

// Options for  cookie
const cookieOptions: CookieSerializeOptions = {
  maxAge,
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

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
        const error: IError = {
          code: "INVALID_BODY",
          message: "Invalid request body",
        };

        throw error;
      }

      // Check email
      if (!validator.isEmail(user.email)) {
        const error: IError = {
          code: "INVALID_EMAIL",
          message: `Invalid email: ${user.email}`,
        };

        throw error;
      }

      // If checkPassword is true validate password
      if (checkPassword) {
        if (!validator.isStrongPassword(user.password)) {
          const error: IError = {
            code: "INVALID_PASSWORD",
            message: "Password is not strong enough",
          };

          throw error;
        }
      }
      break;

    case "profile":
      // TODO: Check if the request body has valid parameters required for profile

      break;
    default:
      const error: IError = {
        code: "UNKNOWN_PARAMETER",
        message: "Unknown parameter",
      };
      throw error;
  }
};

const handleErrors = (err: any): IError[] => {
  let errors: any = {};

  // Duplicate error
  if (err.code === "P2002") {
    errors["duplicate_error"] = "This email already have an account";
    return errors;
  }

  // Validation errors
  if (err.code.includes("INVALID")) {
    errors[`${err.code.slice(8).trim().toLowerCase()}_validation_error`] =
      err.message;
  }

  return errors;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
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
          cookie.serialize("jwt", token, cookieOptions)
        );

        res.status(201).json({ success: true, user: { email: newUser.email } });
        break;

      case "login":
        checkReqBody(req.body, "user", false);

        // Get user from database
        const userFromDatabase = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        // If user is found compare passwords
        if (userFromDatabase) {
          // Compare passwords
          const authenticated = await bcrypt.compare(
            user.password,
            userFromDatabase.password
          );

          // If password matches generate jwt token and send success message
          if (authenticated) {
            // Create a new jwt token
            const token = createToken(userFromDatabase.id);

            // Set cookie
            res.setHeader(
              "Set-Cookie",
              cookie.serialize("jwt", token, cookieOptions)
            );

            // Send success message
            res.status(200).json({
              success: true,
              user: { email: userFromDatabase.email },
            });
          } else {
            // If password does not match throw error
            const error: IError = {
              code: "LOGIN_ERROR",
              message: "Password is incorrect",
            };

            throw error;
          }
        } else {
          // If cannot find the user in the database send 404
          res.status(404).json({
            success: false,
            error: [
              {
                code: "NO_USER",
                message: "User not found",
              },
            ],
          });
        }

        break;

      case "logout":
        /**
         * We can verify that cookie is there but there is no need for that
         */

        // Delete cookie
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("jwt", "", {
            expires: new Date(0),
          })
        );

        res.status(200).json({ success: true });
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
        res.status(400).json({
          success: false,
          error: [
            {
              code: "INVALID_ACTION",
              message: "Unknown action",
            },
          ],
        });
        break;
    }
  } catch (error) {
    console.log(error);

    const errors: IError[] = handleErrors(error);

    res.status(400).json({ success: false, error: errors });
  }
}
