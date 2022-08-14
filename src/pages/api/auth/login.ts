import { NextApiRequest, NextApiResponse } from "next";
import { checkReqBody, cookieOptions, createToken, handleErrors, IError } from "../../../lib/utils";
import bcrypt from "bcrypt";
import cookie from "cookie";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.body;

  try {
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
      const authenticated = await bcrypt.compare(user.password, userFromDatabase.password);

      // If password matches generate jwt token and send success message
      if (authenticated) {
        // Create a new jwt token
        const token = createToken(userFromDatabase.id);

        // Set cookie
        res.setHeader("Set-Cookie", cookie.serialize("jwt", token, cookieOptions));
        console.log(userFromDatabase);
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
        error: {
          code: "NO_USER",
          message: "User not found",
        },
      });
    }
  } catch (error) {
    console.log(error);

    const errors = handleErrors(error);

    res.status(400).json({ success: false, error: errors });
  }
}
