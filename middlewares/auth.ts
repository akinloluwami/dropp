import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";

export const withAuth =
  (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
    const token = getCookie("dropp.token", {
      req,
      res,
    });

    if (!token) {
      return res.status(401).json({ error: "Token is missing in request." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
      id: string;
    };

    req.userId = decoded.id;

    return await handler(req, res);
  };
