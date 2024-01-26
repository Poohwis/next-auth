"use server";

import bcrypt from "bcryptjs"
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingSchema } from "@/schemas";
import * as z from "zod";

export const settings = async (values: z.infer<typeof SettingSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id!);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser) {
      return { error: "Email aleady in use" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {success: "Verification email send"}
  }

  if(values.password && values.newPassword && dbUser.password){
    const passwordsMatch = await bcrypt.compare(values.password, dbUser.password)
    if(!passwordsMatch){
        return {error: "Incorrect password"}
    }
    const hashedsPassword = await bcrypt.hash(values.newPassword, 10)
    values.password = hashedsPassword
    values.newPassword = undefined
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });
  return { success: "Settings updated" };
};
