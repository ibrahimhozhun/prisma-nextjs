import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import cookie from "cookie";
import { checkReqBody, cookieOptions, createToken, handleErrors } from "../../../lib/utils";

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.body;

  try {
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
  } catch (error) {
    console.log(error);

    const errors = handleErrors(error);

    res.status(400).json({ success: false, error: errors });
  }
}
