import { db } from "@/database";
import { files } from "@/database/schema";
import { withAuth } from "@/middlewares/auth";
import { withErrorHandling } from "@/middlewares/error-handling";
import { count, eq, sum } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const offset = (pageNumber - 1) * limitNumber;

  const [userFiles, totalFiles] = await Promise.all([
    db
      .select()
      .from(files)
      .where(eq(files.userId, req.userId!))
      .offset(offset)
      .limit(limitNumber),
    db
      .select({ count: count(files.id) })
      .from(files)
      .where(eq(files.userId, req.userId!)),
  ]);

  return res.status(200).json({
    files: userFiles,
    totalFiles: totalFiles[0]?.count || 0,
    currentPage: pageNumber,
    totalPages: Math.ceil(Number(totalFiles[0]?.count) / limitNumber),
  });
};

export default withErrorHandling(withAuth(handler), "GET");
