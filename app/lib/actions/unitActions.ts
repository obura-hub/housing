"use server";

import { DatabaseError, safeQuery } from "../db";
import { Unit, ProjectUnits } from "../types/unitTypes";

export async function getProjectUnits(
  projectId: number,
): Promise<ProjectUnits | undefined> {
  try {
    // Fetch project basic info
    const projectSql = `
      SELECT id, name, location
      FROM Project
      WHERE id = @p1
    `;
    const { rows: projectRows } = await safeQuery<any>(projectSql, [projectId]);
    if (projectRows.length === 0) return undefined;
    const project = projectRows[0];

    // Fetch project images (ordered by display_order)
    const imagesSql = `
      SELECT image_url AS url
      FROM ProjectImage
      WHERE project_id = @p1
      ORDER BY display_order
    `;
    const { rows: imageRows } = await safeQuery<{ url: string }>(imagesSql, [
      projectId,
    ]);
    const images = imageRows.map((row) => row.url);

    // Fetch units for this project (only available ones)
    const unitsSql = `
      SELECT
        id,
        type,
        category,
        price,
        monthly_repayment AS monthlyRepayment,
        area,
        bedrooms,
        bathrooms,
        kitchens
      FROM Unit
      WHERE project_id = @p1 AND status = 'available'
      ORDER BY type, price
    `;
    const { rows: unitRows } = await safeQuery<Unit>(unitsSql, [projectId]);

    return {
      id: project.id,
      name: project.name,
      location: project.location,
      images,
      units: unitRows,
    };
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    console.error("Failed to fetch project units:", error);
    throw new Error("Failed to fetch project units");
  }
}

export interface UnitDetails {
  unitId: number;
  unitNumber: string;
  floorNumber: number;
  projectId: number;
  projectName: string;
  projectLocation: string;
  unitTypeId: number;
  unitType: string;
  bedrooms: number;
  bathrooms: number;
  size: string;
  basePrice: string;
  priceAdjustment: number;
  totalPrice: number;
  status: string;
  images: string[]; // at least cover image
}

export async function getUnitDetails(
  unitId: number,
): Promise<UnitDetails | null> {
  try {
    const sql = `
      SELECT
        u.id AS unitId,
        u.unit_number AS unitNumber,
        u.status,
        u.price_adjustment AS priceAdjustment,
        f.floor_number AS floorNumber,
        p.id AS projectId,
        p.name AS projectName,
        p.location AS projectLocation,
        ut.id AS unitTypeId,
        ut.type AS unitType,
        ut.bedrooms,
        ut.bathrooms,
        ut.size,
        ut.price AS basePrice,
        (SELECT TOP 1 pi.image_url FROM ProjectImage pi WHERE pi.project_id = p.id ORDER BY pi.display_order) AS coverImage
      FROM Unit u
      JOIN Floor f ON u.floor_id = f.id
      JOIN Block b ON f.block_id = b.id
      JOIN Project p ON b.project_id = p.id
      JOIN UnitType ut ON u.unit_type_id = ut.id
      WHERE u.id = @p1
    `;
    const { rows } = await safeQuery<any>(sql, [unitId]);
    if (rows.length === 0) return null;
    const row = rows[0];
    const basePriceNum = parseFloat(row.basePrice.replace(/[^0-9.-]+/g, ""));
    const totalPrice = basePriceNum + (row.priceAdjustment || 0);
    return {
      unitId: row.unitId,
      unitNumber: row.unitNumber,
      floorNumber: row.floorNumber,
      projectId: row.projectId,
      projectName: row.projectName,
      projectLocation: row.projectLocation,
      unitTypeId: row.unitTypeId,
      unitType: row.unitType,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      size: row.size,
      basePrice: row.basePrice,
      priceAdjustment: row.priceAdjustment || 0,
      totalPrice,
      status: row.status,
      images: [row.coverImage].filter(Boolean),
    };
  } catch (error) {
    console.error("Failed to fetch unit details:", error);
    throw new Error("Failed to fetch unit details");
  }
}
