"use server";
import { safeQuery } from "@/lib/db";

export async function getCheckoutDetails(unitId: number, unitTypeId: number) {
  const sql = `
    SELECT
      u.id AS unit_id,
      u.unit_number,
      u.price_adjustment,
      ut.id AS unit_type_id,
      ut.type AS unit_type,
      ut.size,
      ut.bedrooms,
      ut.bathrooms,
      ut.price AS base_price,
      ut.image_url AS unit_type_image,
      p.id AS project_id,
      p.name AS project_name,
      p.location,
      b.id AS block_id,
      b.name AS block_name,
      f.floor_number
    FROM Unit u
    JOIN UnitType ut ON u.unit_type_id = ut.id
    JOIN Floor f ON u.floor_id = f.id
    JOIN Block b ON f.block_id = b.id
    JOIN Project p ON b.project_id = p.id
    WHERE u.id = @p1 AND ut.id = @p2
  `;
  const { rows } = await safeQuery(sql, [unitId, unitTypeId]);
  if (rows.length === 0) return null;
  const unit = rows[0];
  const basePriceNum = parseFloat(unit.base_price.replace(/[^0-9.-]+/g, ""));
  const totalPrice = basePriceNum + (unit.price_adjustment || 0);
  return { ...unit, total_price: totalPrice };
}
