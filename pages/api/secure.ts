import { db } from "@/database";
import { files } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const files__ = await db.select().from(files);

  for (const file of files__) {
    const url = file.url;

    const secureUrl = url?.replace("http://", "https://");

    await db
      .update(files)
      .set({
        ...file,
        secureUrl,
      })
      .where(eq(files.id, file.id));
  }

  return res.status(200).json({
    message: "Done",
  });
};

export default handler;
