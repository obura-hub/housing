"use server";

import { safeQuery } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getFloorLayout(floorId: number) {
  // Get floor details
  const floorSql = `
    SELECT id, floor_number AS floorNumber, rows, cols, block_id
    FROM Floor
    WHERE id = @p1
  `;
  const { rows: floorRows } = await safeQuery(floorSql, [floorId]);
  if (floorRows.length === 0) return null;
  const floor = floorRows[0];

  // Get existing units with their unit type details
  const unitsSql = `
    SELECT
      u.id,
      u.unit_number AS unitNumber,
      u.position_row AS row,
      u.position_col AS col,
      u.unit_type_id AS unitTypeId,
      ut.type AS unitTypeName,
      ut.price AS unitTypePrice
    FROM Unit u
    LEFT JOIN UnitType ut ON u.unit_type_id = ut.id
    WHERE u.floor_id = @p1
    ORDER BY u.position_row, u.position_col
  `;
  const { rows: unitRows } = await safeQuery(unitsSql, [floorId]);

  // Build cells array (convert unitTypeId to string for consistency)
  const cells = unitRows.map((unit: any) => ({
    row: unit.row,
    col: unit.col,
    unitNumber: unit.unitNumber,
    unitTypeId: unit.unitTypeId ? String(unit.unitTypeId) : null,
    unitTypeName: unit.unitTypeName,
    unitPrice: unit.unitTypePrice,
    existingUnitId: unit.id,
  }));

  return { floor, cells };
}

export async function updateFloorLayout(floorId: number, cells: any[]) {
  // Delete all existing units on this floor
  const deleteSql = `DELETE FROM Unit WHERE floor_id = @p1`;
  await safeQuery(deleteSql, [floorId]);

  // Insert new units for cells that have a unitTypeId
  for (const cell of cells) {
    if (cell.unitTypeId && cell.unitTypeId !== null && cell.unitTypeId !== "") {
      const unitTypeId = parseInt(cell.unitTypeId);
      if (isNaN(unitTypeId)) continue;
      const insertSql = `
        INSERT INTO Unit (floor_id, unit_number, unit_type_id, status, position_row, position_col, price_adjustment)
        VALUES (@p1, @p2, @p3, 'available', @p4, @p5, 0)
      `;
      await safeQuery(insertSql, [
        floorId,
        cell.unitNumber,
        unitTypeId,
        cell.row,
        cell.col,
      ]);
    }
  }

  revalidatePath(`/admin/projects/*`);
  return { success: true };
}
