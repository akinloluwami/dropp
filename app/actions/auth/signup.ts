import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import { db } from "@/database";
import { users } from "@/database/schema";
import bcrypt from "bcryptjs";

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { name, email, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { success: true };
}
