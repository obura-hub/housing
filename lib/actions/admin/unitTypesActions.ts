"use server";

import { safeQuery } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProjectUnitTypes(projectId: number) {
  const sql = `
    SELECT id, type, size, price, bedrooms, bathrooms,
           image_url AS image, model_3d_url AS model3d, sort_order
    FROM UnitType
    WHERE project_id = @p1
    ORDER BY sort_order
  `;
  const { rows } = await safeQuery(sql, [projectId]);
  return rows;
}

export async function createUnitType(projectId: number, formData: FormData) {
  const type = formData.get("type") as string;
  const size = formData.get("size") as string;
  const price = formData.get("price") as string;
  const bedrooms = parseInt(formData.get("bedrooms") as string);
  const bathrooms = parseInt(formData.get("bathrooms") as string);
  const image = formData.get("image") as string;
  const model3d = formData.get("model3d") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  const sql = `
    INSERT INTO UnitType (project_id, type, size, price, bedrooms, bathrooms, image_url, model_3d_url, sort_order)
    VALUES (@p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9)
  `;
  await safeQuery(sql, [
    projectId,
    type,
    size,
    price,
    bedrooms,
    bathrooms,
    image || null,
    model3d || null,
    sortOrder,
  ]);
  revalidatePath(`/admin/projects/${projectId}/edit/unit-types`);
  return { success: true };
}

export async function updateUnitType(unitTypeId: number, formData: FormData) {
  const type = formData.get("type") as string;
  const size = formData.get("size") as string;
  const price = formData.get("price") as string;
  const bedrooms = parseInt(formData.get("bedrooms") as string);
  const bathrooms = parseInt(formData.get("bathrooms") as string);
  const image = formData.get("image") as string;
  const model3d = formData.get("model3d") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  const sql = `
    UPDATE UnitType
    SET type = @p2, size = @p3, price = @p4, bedrooms = @p5, bathrooms = @p6,
        image_url = @p7, model_3d_url = @p8, sort_order = @p9
    WHERE id = @p1
  `;
  await safeQuery(sql, [
    unitTypeId,
    type,
    size,
    price,
    bedrooms,
    bathrooms,
    image || null,
    model3d || null,
    sortOrder,
  ]);
  revalidatePath(`/admin/projects/*`);
  return { success: true };
}

export async function deleteUnitType(unitTypeId: number) {
  // Check if any units reference this unit type
  const checkSql = `SELECT COUNT(*) AS count FROM Unit WHERE unit_type_id = @p1`;
  const { rows } = await safeQuery(checkSql, [unitTypeId]);
  if (rows[0].count > 0) {
    throw new Error(
      "Cannot delete unit type because it is assigned to existing units.",
    );
  }
  const sql = `DELETE FROM UnitType WHERE id = @p1`;
  await safeQuery(sql, [unitTypeId]);
  revalidatePath(`/admin/projects/*`);
  return { success: true };
}
