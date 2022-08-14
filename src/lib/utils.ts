import { CookieSerializeOptions } from "cookie";
import jwt from "jsonwebtoken";
import validator from "validator";

export interface IError {
  code: string;
  message: string;
}

export type ResponseType = {
  success: boolean;
  user?: {
    email: string;
  };
  error?: IError;
};
// 7 days
const maxAge = 7 * 24 * 60 * 60;

// Options for  cookie
export const cookieOptions: CookieSerializeOptions = {
  maxAge,
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

export const createToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "", { expiresIn: maxAge });
};

export const checkReqBody = (
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

export const handleErrors = (err: any) => {
  try {
    // Duplicate error
    if (err.code === "P2002") {
      return {
        code: "duplicate_error",
        message: "This email already have an account",
      };
    }

    return err;
  } catch (err) {
    return {
      code: "unknown_error",
      message: err,
    };
  }
};
