import { db } from "@/database";
import { users } from "@/database/schema";
import { withAuth } from "@/middlewares/auth";
import { withErrorHandling } from "@/middlewares/error-handling";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const [user] = await db.select().from(users).where(eq(users.id, req.userId!));

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  return res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
};

export default withErrorHandling(withAuth(handler), "GET");
