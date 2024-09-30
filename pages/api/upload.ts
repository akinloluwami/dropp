import { bucket } from "@/config/gcs";
import { logsnag } from "@/config/logsnag";
import { db } from "@/database";
import { files } from "@/database/schema";
import { withAuth } from "@/middlewares/auth";
import { withErrorHandling } from "@/middlewares/error-handling";
import { eq } from "drizzle-orm";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = upload.single("file");

const generateRandomFileName = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    uploadHandler(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({ error: "Error during file upload" });
      }

      //@ts-ignore
      if (!req.file) {
        return res.status(400).json({ error: "File not found" });
      }

      //@ts-ignore
      const originalName = req.file.originalname;
      const extension = originalName.split(".").pop();

      const randomFileName = `${generateRandomFileName()}.${extension}`;

      //@ts-ignore
      const blob = bucket.file(randomFileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          //@ts-ignore
          contentType: req.file.mimetype,
        },
      });

      blobStream.on("error", (error) => {
        console.error("Error during file upload:", error);
        reject(res.status(500).json({ error: "Error while uploading file" }));
      });

      blobStream.on("finish", async () => {
        const publicUrl = `http://${bucket.name}/${blob.name}`;

        const fileDetails = {
          name: originalName,
          //@ts-ignore
          type: req.file.mimetype,
          //@ts-ignore
          size: req.file.size,
          url: publicUrl,
          extension,
        };

        if (req.userId) {
          const files__ = await db
            .select()
            .from(files)
            .where(eq(files.userId, req.userId!));

          if (files__.length === 0) {
            await logsnag.track({
              channel: "file-uploads",
              event: "user-upload-first-file",
              icon: "🗃️",
              notify: true,
              user_id: req.userId,
            });
          }
        }

        await db.insert(files).values({
          ...fileDetails,
          userId: req.userId,
          generatedName: randomFileName,
          originalName,
        });

        resolve(res.status(200).json({ url: publicUrl, fileDetails }));
      });

      //@ts-ignore
      blobStream.end(req.file.buffer);
    });
  });
};

export default withErrorHandling(
  withAuth(handler, {
    open: true,
  }),
  "POST"
);
