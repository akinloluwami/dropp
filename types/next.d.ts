import { NextApiRequest } from "next";

declare module "next" {
  interface NextApiRequest {
    userId?: string;
  }
}
