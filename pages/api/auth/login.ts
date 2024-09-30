import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next/types";
import { compare } from "bcryptjs";
import { withErrorHandling } from "@/middlewares/error-handling";
import { setTokenCookie } from "@/helpers/auth/setTokenCookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const isPasswordValid = await compare(password, user.password!);

  if (!isPasswordValid) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  setTokenCookie(req, res, user.id!);

  return res.status(200).json({
    message: "Logged in successfully",
  });
};

export default withErrorHandling(handler, "POST");
