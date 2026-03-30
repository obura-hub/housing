import { DatabaseError, safeQuery } from "../db";

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