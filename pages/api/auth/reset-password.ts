import { op } from "@/config/openpanel";
import { db } from "@/database";
import { users } from "@/database/schema";
import { withErrorHandling } from "@/middlewares/error-handling";
import { generateAlphabeticalOtp } from "@/utils/otp";
import { hash, hashSync } from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password, passwordConfirm, resetToken } = req.body;

  const [user] = await db
    .select()
    .from(users)
    .where(
      and(eq(users.email, email), eq(users.passwordResetToken, resetToken))
    );

  if (!user) {
    return res.status(404).json({
      error: "Invalid email or password reset token.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long.",
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      error: "Passwords do not match.",
    });
  }

  await db
    .update(users)
    .set({
      password: hashSync(password, 10),
    })
    .where(eq(users.id, user.id));

  await op.track("password-reset", {
    profileId: user.id,
  });

  return res.status(200).json({
    message: "New password set successfully.",
  });
};

export default withErrorHandling(handler, "POST");
