import { op } from "@/config/openpanel";
import { db } from "@/database";
import { users } from "@/database/schema";
import { withAuth } from "@/middlewares/auth";
import { withErrorHandling } from "@/middlewares/error-handling";
import { and, eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      error: "OTP is required",
    });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.otp, otp), eq(users.id, req.userId!)));

  if (!user || user.otp !== otp) {
    return res.status(401).json({
      error: "Invalid OTP",
    });
  }

  await db
    .update(users)
    .set({
      isVerified: true,
    })
    .where(eq(users.id, req.userId!));

  await op.track("email-verified", {
    profileId: req.userId,
  });

  return res.status(200).json({
    message: "OTP verified successfully",
  });
};

export default withErrorHandling(withAuth(handler), "POST");
