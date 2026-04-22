"use server";

import bcrypt from "bcryptjs";
import { safeQuery } from "../db";

export async function completeRegistration(
  userId: string,
  email: string,
  password: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `
    UPDATE [User]
    SET Password = @p3, email = @p2, Status = 'active'
    WHERE UserId = @p1
  `;
  await safeQuery(sql, [userId, email, hashedPassword]);
  return { success: true };
}
