"use server";

import { LoginFormSchema, LoginFormState } from "@/app/lib/definitions";
import { db } from "@/database";
import { users } from "@/database/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function login(state: LoginFormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email, password } = validatedFields.data;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return {
      message: "Invalid email or password",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password!);

  if (!isPasswordValid) {
    return {
      message: "Invalid email or password",
    };
  }

  return { success: true };
}
