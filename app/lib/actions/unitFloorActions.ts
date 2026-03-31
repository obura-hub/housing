"use server";

import { auth } from "@/auth";
import { safeQuery } from "../db";

export interface FloorAvailability {
  floor: number;
  availableUnits: number;
}

export interface UnitInfo {
  id: number;
  unitCode: string;
  floor: number;
  unitNumber: string;
  area: number;
  status: string;
}

export async function getFloorAvailability(
  projectId: number,
  unitTypeId: number,
): Promise<FloorAvailability[]> {
  try {
    const sql = `
      SELECT
        floor,
        COUNT(*) AS availableUnits
      FROM Unit
      WHERE project_id = @p1
        AND unit_type_id = @p2
        AND status = 'available'
      GROUP BY floor
      ORDER BY floor
    `;
    const { rows } = await safeQuery<any>(sql, [projectId, unitTypeId]);
    return rows.map((row) => ({
      floor: row.floor,
      availableUnits: row.availableUnits,
    }));
  } catch (error) {
    console.error("Failed to fetch floor availability:", error);
    throw new Error("Unable to load floor availability");
  }
}

export async function getUnitsOnFloor(
  projectId: number,
  unitTypeId: number,
  floor: number,
): Promise<UnitInfo[]> {
  try {
    const sql = `
      SELECT
        id,
        unit_code AS unitCode,
        floor,
        unit_number AS unitNumber,
        area,
        status
      FROM Unit
      WHERE project_id = @p1
        AND unit_type_id = @p2
        AND floor = @p3
        AND status = 'available'
      ORDER BY unit_number
    `;
    const { rows } = await safeQuery<UnitInfo>(sql, [
      projectId,
      unitTypeId,
      floor,
    ]);
    return rows;
  } catch (error) {
    console.error("Failed to fetch units on floor:", error);
    throw new Error("Unable to load floor layout");
  }
}

// Reserve a unit for the current user (temporary hold)

export async function reserveUnit(
  unitId: number,
): Promise<{ success: boolean; reservationId?: number; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in to reserve a unit.",
    };
  }

  const userId = session.user.id;

  try {
    // Check if unit is still available
    const checkSql = `SELECT status FROM Unit WHERE id = @p1`;
    const { rows } = await safeQuery<any>(checkSql, [unitId]);
    if (rows.length === 0 || rows[0].status !== "available") {
      return { success: false, error: "Unit is no longer available" };
    }

    // Insert reservation
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    const insertSql = `
      INSERT INTO Reservation (unit_id, user_id, expires_at)
      OUTPUT INSERTED.id
      VALUES (@p1, @p2, @p3)
    `;
    const { rows: inserted } = await safeQuery<{ id: number }>(insertSql, [
      unitId,
      userId,
      expiresAt,
    ]);

    // Optionally mark unit as reserved in Unit table
    const updateSql = `UPDATE Unit SET status = 'reserved' WHERE id = @p1`;
    await safeQuery(updateSql, [unitId]);

    return { success: true, reservationId: inserted[0].id };
  } catch (error) {
    console.error("Failed to reserve unit:", error);
    return { success: false, error: "Reservation failed" };
  }
}
