import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Delete cookie
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("jwt", "", {
      expires: new Date(0),
    })
  );

  res.status(200).json({ success: true });
}
