import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { sign } from "jsonwebtoken";
import dayjs from "dayjs";

export const setTokenCookie = (
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) => {
  const token = sign({ id }, process.env.JWT_SECRET_KEY!);

  setCookie("dropp.token", token, {
    req,
    res,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: dayjs().add(90, "days").toDate(),
    sameSite: "strict",
  });
};
