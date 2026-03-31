// lib/actions/unitTypeActions.ts
"use server";

import { DatabaseError, safeQuery } from "../db";
import { UnitType } from "../types/projectsTypes";

export async function getUnitType(id: number): Promise<UnitType | undefined> {
  try {
    const sql = `
      SELECT
        id,
        project_id AS projectId,
        type,
        size,
        price,
        bedrooms,
        bathrooms,
        sort_order AS sortOrder
      FROM UnitType
      WHERE id = @p1
    `;

    const { rows } = await safeQuery<UnitType>(sql, [id]);
    return rows[0];
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    console.error("Failed to fetch unit type:", error);
    throw new Error("Failed to fetch unit type");
  }
}
