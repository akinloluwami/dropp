import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next/types";
import { compare } from "bcryptjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return {
      message: "Invalid email or password",
    };
  }

  const isPasswordValid = await compare(password, user.password!);

  if (!isPasswordValid) {
    return {
      message: "Invalid email or password",
    };
  }
};
