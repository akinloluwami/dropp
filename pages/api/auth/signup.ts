import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next/types";
import { hash } from "bcryptjs";
import { withErrorHandling } from "@/middlewares/error-handling";
import { setTokenCookie } from "@/helpers/auth/setTokenCookie";
import { logsnag } from "@/config/logsnag";
import { op } from "@/config/openpanel";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      error: "Passwords do not match",
    });
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (existingUser) {
    return res.status(400).json({
      error: "Email is already registered",
    });
  }

  const hashedPassword = await hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning();

  if (!newUser) {
    return res.status(500).json({
      error: "Failed to create user",
    });
  }

  await op.identify({
    profileId: newUser.id,
    email: newUser.email!,
    properties: {
      name: newUser.name,
    },
  });

  await logsnag.identify({
    user_id: newUser.id,
    properties: {
      name: newUser.name!,
      email: newUser.email!,
    },
  });

  await op.track("signup", {
    profileId: newUser.id,
    name: newUser.name,
    email: newUser.email,
  });

  await logsnag.track({
    channel: "users",
    event: "user-created",
    description: newUser.email!,
    icon: "🔥",
    notify: true,
    user_id: newUser.id,
  });

  setTokenCookie(req, res, newUser?.id);

  return res.status(201).json({
    message: "Account created successfully",
  });
};

export default withErrorHandling(handler, "POST");
