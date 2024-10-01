import { OpenPanel } from "@openpanel/nextjs";

export const op = new OpenPanel({
  clientId: "e78a87b5-4898-477c-ab2d-def205feb7fd",
  clientSecret: process.env.OPEN_PANEL_SECRET,
});
