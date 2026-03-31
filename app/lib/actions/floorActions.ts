"use server";

import { safeQuery } from "../db";

export interface FloorWithUnits {
  id: number;
  floorNumber: number;
  totalUnits: number;
  availableUnits: number;
  units: Unit[];
}

export interface Unit {
  id: number;
  unitNumber: string;
  status: string;
  positionRow: number | null;
  positionCol: number | null;
  priceAdjustment: number;
}

export async function getFloorsWithUnits(
  projectId: number,
  unitTypeId: number,
): Promise<FloorWithUnits[]> {
  try {
    // Fetch floors
    const floorsSql = `
      SELECT id, floor_number AS floorNumber, layout_config AS layoutConfig
      FROM Floor
      WHERE project_id = @p1 AND unit_type_id = @p2
      ORDER BY floor_number
    `;
    const { rows: floors } = await safeQuery<any>(floorsSql, [
      projectId,
      unitTypeId,
    ]);

    if (floors.length === 0) return [];

    // Fetch units for all floors
    const floorIds = floors.map((f) => f.id);
    const unitsSql = `
      SELECT
        u.id, u.unit_number AS unitNumber, u.status,
        u.position_row AS positionRow, u.position_col AS positionCol,
        u.price_adjustment AS priceAdjustment,
        u.floor_id AS floorId
      FROM Unit u
      WHERE u.floor_id IN (${floorIds.join(",")})
    `;
    const { rows: units } = await safeQuery<any>(unitsSql, []);

    // Group units by floorId
    const unitsByFloor = new Map<number, Unit[]>();
    for (const unit of units) {
      if (!unitsByFloor.has(unit.floorId)) unitsByFloor.set(unit.floorId, []);
      unitsByFloor.get(unit.floorId)!.push({
        id: unit.id,
        unitNumber: unit.unitNumber,
        status: unit.status,
        positionRow: unit.positionRow,
        positionCol: unit.positionCol,
        priceAdjustment: unit.priceAdjustment,
      });
    }

    return floors.map((floor) => {
      const floorUnits = unitsByFloor.get(floor.id) || [];
      const availableUnits = floorUnits.filter(
        (u) => u.status === "available",
      ).length;
      return {
        id: floor.id,
        floorNumber: floor.floorNumber,
        totalUnits: floorUnits.length,
        availableUnits,
        units: floorUnits,
      };
    });
  } catch (error) {
    console.error("Failed to fetch floors with units:", error);
    throw new Error("Failed to fetch floor data");
  }
}
