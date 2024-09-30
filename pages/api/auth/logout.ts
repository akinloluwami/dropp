import { NextApiRequest, NextApiResponse } from "next/types";
import { withAuth } from "@/middlewares/auth";
import { withErrorHandling } from "@/middlewares/error-handling";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    "Set-Cookie",
    `dropp.token=; Path=/; Domain=${process.env.COOKIE_DOMAIN}; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`
  );

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

export default withErrorHandling(withAuth(handler), "POST");
