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

export interface FloorWithUnits {
  id: number;
  floorNumber: number;
  layoutConfig?: { rows: number; cols: number } | null; // add
  totalUnits: number;
  availableUnits: number;
  units: Unit[];
}

export async function getFloorsWithUnits(
  projectId: number,
  unitTypeId: number,
): Promise<FloorWithUnits[]> {
  try {
    const floorsSql = `
      SELECT DISTINCT
        f.id,
        f.floor_number AS floorNumber,
        f.layout_config AS layoutConfig,
        f.sort_order AS sortOrder
      FROM Floor f
      INNER JOIN Block b ON f.block_id = b.id
      INNER JOIN Project p ON b.project_id = p.id
      INNER JOIN Unit u ON u.floor_id = f.id
      WHERE p.id = @p1
        AND u.unit_type_id = @p2
      ORDER BY f.floor_number
    `;
    const { rows: floors } = await safeQuery<any>(floorsSql, [
      projectId,
      unitTypeId,
    ]);

    if (floors.length === 0) return [];

    const floorIds = floors.map((f) => f.id);
    const unitsSql = `
      SELECT
        u.id,
        u.unit_number AS unitNumber,
        u.status,
        u.position_row AS positionRow,
        u.position_col AS positionCol,
        u.price_adjustment AS priceAdjustment,
        u.floor_id AS floorId
      FROM Unit u
      WHERE u.floor_id IN (${floorIds.join(",")})
        AND u.unit_type_id = @p1
    `;
    const { rows: units } = await safeQuery<any>(unitsSql, [unitTypeId]);

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
      let layoutConfig: { rows: number; cols: number } | null = null;
      if (floor.layoutConfig) {
        try {
          layoutConfig = JSON.parse(floor.layoutConfig);
        } catch (e) {
          console.error(
            `Failed to parse layout_config for floor ${floor.id}:`,
            e,
          );
        }
      }
      const floorUnits = unitsByFloor.get(floor.id) || [];
      const availableUnits = floorUnits.filter(
        (u) => u.status === "available",
      ).length;
      return {
        id: floor.id,
        floorNumber: floor.floorNumber,
        layoutConfig,
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
