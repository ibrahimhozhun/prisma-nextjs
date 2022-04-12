import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

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
  user?: User;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>
) {
  const { user } = req.body;
  const { action } = req.query;

  // Execute different actions depending on the action
  switch (action) {
    case "register":
      // Register user
      break;

    case "login":
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
      res.status(404).json({ success: false });
      break;
  }
}
