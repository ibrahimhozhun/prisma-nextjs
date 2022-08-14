import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { handleErrors, IError } from "../../../lib/utils";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  try {
    const jwt_token = req.cookies.jwt;

    if (jwt_token) {
      // Verify token
      jwt.verify(jwt_token, process.env.JWT_SECRET || "", async (error: any, decodedToken: any) => {
        if (error) {
          const error: IError = {
            code: "INVALID_TOKEN",
            message: "Authentication token is invalid",
          };

          throw error;
        } else {
          // If token is valid we get the user with the id at token
          const userFromDB = await prisma.user.findUnique({
            where: {
              id: decodedToken.id,
            },
          });

          if (userFromDB) {
            // We pass the user as an argument so we can use it in this function later
            res.status(200).json({ success: true, user: { email: userFromDB.email } });
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
        }
      });
    } else {
      const error: IError = {
        code: "NO_TOKEN",
        message: "No token found",
      };

      throw error;
    }
  } catch (error) {
    console.log(error);

    const errors = handleErrors(error);

    res.status(400).json({ success: false, error: errors });
  }
}
