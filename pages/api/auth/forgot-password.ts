import { op } from "@/config/openpanel";
import { db } from "@/database";
import { users } from "@/database/schema";
import { withAuth } from "@/middlewares/auth";
import { withErrorHandling } from "@/middlewares/error-handling";
import { generateAlphabeticalOtp } from "@/utils/otp";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return res.status(404).json({
      error: "There is no account associated with this email",
    });
  }

  const passwordResetToken = generateAlphabeticalOtp();

  await db
    .update(users)
    .set({
      passwordResetToken,
    })
    .where(eq(users.id, user.id));

  await fetch("https://api.useplunk.com/v1/send", {
    method: "POST",
    body: JSON.stringify({
      to: user.email,
      subject: "Password Reset",
      body: `
        Hi ${user.name},<br>
        A password reset has been requested for your Dropp account. <br> <br>
        Use the OTP below<br> <br>
        <h1>${passwordResetToken}</h1>
<br>

<p>Kindly disregard this email if you did not make this request.</p>

        Cheers, <br>
        Akinkunmi
        `,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PLUNK_API_KEY}`,
    },
  });

  return res.status(200).json({
    message: "Password Reset Token Sent",
  });
};

export default withErrorHandling(handler, "POST");
