import { Storage } from "@google-cloud/storage";

export const gcs = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS!),
});

export const bucket = gcs.bucket("cdn.dropp.cloud");
