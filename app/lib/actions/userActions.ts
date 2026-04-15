// lib/actions/userActions.ts
"use server";

import { DatabaseError, safeQuery } from "../db";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export interface UserData {
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  nationalId: string;
  personalNumber: string;
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session || !session.user) return null;

  console.log("user session", session.user);
  // Fetch full user details from DB
  const id = session.user.email;
  if (!id) return null;
  const user = await getUserById(id);
  return user;
}

export async function getUserById(id: string): Promise<LoginUser | null> {
  try {
    const sql = `
      SELECT userId, email, fullName, phone, nationalId, personalNumber, role, status
      FROM [User]
      WHERE userId = @p1
    `;
    const { rows } = await safeQuery<LoginUser>(sql, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Failed to fetch user by id:", error);
    return null;
  }
}

export async function getUser(email: string): Promise<LoginUser | undefined> {
  try {
    const sql = `
      SELECT TOP 1
        u.email,
        u.password,
        u.role,
        u.status
      FROM [User] u
      WHERE u.email = @p1`;

    const { rows } = await safeQuery<LoginUser>(sql, [email]);
    return rows[0];
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    console.error("Failed to fetch user:", error);
    throw error;
  }
}

function formatDob(dob: string): string {
  const [day, month, year] = dob.split("/");
  return `${year}-${month}-${day}`; // ISO format (YYYY-MM-DD)
}

export async function getUserByDob(dob: string): Promise<UserData | null> {
  try {
    const formattedDob = formatDob(dob);

    const sql = `
      SELECT TOP 1
        fullName,
        dob,
        phone,
        email,
        nationalId,
        personalNumber
      FROM [User]
      WHERE CAST(dob AS DATE) = @p1
    `;

    const { rows } = await safeQuery<UserData>(sql, [formattedDob]);
    return rows[0] || null;
  } catch (error) {
    console.error("Failed to fetch user by dob:", error);
    return null;
  }
}

function formatDobToYMD(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

export async function registerUser(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const rawDob = formData.get("dob") as string;
    const dob = formatDobToYMD(rawDob);
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const nationalId = formData.get("nationalId") as string;
    const personalNumber = formData.get("personalNumber") as string;
    const password = formData.get("password") as string;

    console.log("Received registration data:", {
      fullName,
      dob,
      phone,
      email,
    });

    // Basic validation
    if (
      !fullName ||
      !dob ||
      !phone ||
      !email ||
      !nationalId ||
      !personalNumber ||
      !password
    ) {
      return { success: false, error: "All fields are required" };
    }

    // Find existing user by nationalId or email
    const findUserSql = `
      SELECT userId FROM [User] WHERE nationalId = @p1 OR email = @p2
    `;
    const existing = await safeQuery<{ userId: number }>(findUserSql, [
      nationalId,
      email,
    ]);
    if (existing.rows.length === 0) {
      return {
        success: false,
        error: "User not found. Please contact support.",
      };
    }

    const userId = existing.rows[0].userId;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user record
    const updateSql = `
      UPDATE [User]
      SET fullName = @p2,
          dob = @p3,
          phone = @p4,
          email = @p5,
          nationalId = @p6,
          personalNumber = @p7,
          password = @p8,
          role = @p9,
          status = @p10
      WHERE userId = @p1
    `;
    await safeQuery(updateSql, [
      userId,
      fullName,
      dob,
      phone,
      email,
      nationalId,
      personalNumber,
      hashedPassword,
      "user",
      "active",
    ]);

    return { success: true };
  } catch (error) {
    console.error("Registration failed:", error);
    return { success: false, error: "Registration failed. Please try again." };
  }
}
export interface LoginUser {
  id: number;
  email: string;
  password: string;
  role: string;
  status: string;
  fullName: string;
  nationalId: string;
  personalNumber: string;
  // other fields
}

export async function getUserByIdentifier(
  identifier: string,
): Promise<LoginUser | null> {
  try {
    const sql = `
      SELECT TOP 1
        userId,
        email,
        password,
        role,
        status,
        fullName,
        nationalId,
        personalNumber
      FROM [User]
      WHERE email = @p1
         OR nationalId = @p1
         OR personalNumber = @p1
    `;
    const { rows } = await safeQuery<LoginUser>(sql, [identifier]);

    return rows[0] || null;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    console.error("Failed to fetch user by identifier:", error);
    return null;
  }
}
