"use server";

import { safeQuery } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProjectBlocks(projectId: number) {
  const sql = `
    SELECT id, name, description, image_url AS image, model_3d_url AS model3d, sort_order
    FROM Block
    WHERE project_id = @p1
    ORDER BY sort_order
  `;
  const { rows } = await safeQuery(sql, [projectId]);
  return rows;
}

export async function getBlockById(blockId: number) {
  const sql = `
    SELECT id, project_id, name, description, image_url AS image, model_3d_url AS model3d, sort_order
    FROM Block
    WHERE id = @p1
  `;
  const { rows } = await safeQuery(sql, [blockId]);
  return rows[0] || null;
}

export async function createBlock(projectId: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const model3d = formData.get("model3d") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  const sql = `
    INSERT INTO Block (project_id, name, description, image_url, model_3d_url, sort_order)
    VALUES (@p1, @p2, @p3, @p4, @p5, @p6)
  `;
  await safeQuery(sql, [
    projectId,
    name,
    description || null,
    image || null,
    model3d || null,
    sortOrder,
  ]);
  revalidatePath(`/admin/projects/${projectId}/edit/blocks`);
  return { success: true };
}

export async function updateBlock(blockId: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const model3d = formData.get("model3d") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  const sql = `
    UPDATE Block
    SET name = @p2, description = @p3, image_url = @p4, model_3d_url = @p5, sort_order = @p6
    WHERE id = @p1
  `;
  await safeQuery(sql, [
    blockId,
    name,
    description || null,
    image || null,
    model3d || null,
    sortOrder,
  ]);
  revalidatePath(`/admin/projects/*`);
  return { success: true };
}

export async function deleteBlock(blockId: number) {
  // Check if block has floors
  const checkSql = `SELECT COUNT(*) AS count FROM Floor WHERE block_id = @p1`;
  const { rows } = await safeQuery(checkSql, [blockId]);
  if (rows[0].count > 0) {
    throw new Error(
      "Cannot delete block because it contains floors. Delete floors first.",
    );
  }
  const sql = `DELETE FROM Block WHERE id = @p1`;
  await safeQuery(sql, [blockId]);
  revalidatePath(`/admin/projects/*`);
  return { success: true };
}

// ========== FLOOR ACTIONS ==========

export async function getBlockFloors(blockId: number) {
  const sql = `
    SELECT id, floor_number AS floorNumber, rows, cols, floor_plan_image AS floorPlanImage, sort_order
    FROM Floor
    WHERE block_id = @p1
    ORDER BY floor_number
  `;
  const { rows } = await safeQuery(sql, [blockId]);
  return rows;
}

export async function getFloorById(floorId: number) {
  const sql = `
    SELECT id, block_id, floor_number AS floorNumber, rows, cols, floor_plan_image AS floorPlanImage, sort_order
    FROM Floor
    WHERE id = @p1
  `;
  const { rows } = await safeQuery(sql, [floorId]);
  return rows[0] || null;
}

export async function createFloor(blockId: number, formData: FormData) {
  const floorNumber = parseInt(formData.get("floorNumber") as string);
  const rows = parseInt(formData.get("rows") as string);
  const cols = parseInt(formData.get("cols") as string);
  const floorPlanImage = formData.get("floorPlanImage") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  const sql = `
    INSERT INTO Floor (block_id, floor_number, rows, cols, floor_plan_image, sort_order)
    VALUES (@p1, @p2, @p3, @p4, @p5, @p6)
  `;
  await safeQuery(sql, [
    blockId,
    floorNumber,
    rows,
    cols,
    floorPlanImage || null,
    sortOrder,
  ]);
  revalidatePath(`/admin/projects/*`);
  return { success: true };
}

export async function updateFloor(floorId: number, formData: FormData) {
  const floorNumber = parseInt(formData.get("floorNumber") as string);
  const rows = parseInt(formData.get("rows") as string);
  const cols = parseInt(formData.get("cols") as string);
  const floorPlanImage = formData.get("floorPlanImage") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  const sql = `
    UPDATE Floor
    SET floor_number = @p2, rows = @p3, cols = @p4, floor_plan_image = @p5, sort_order = @p6
    WHERE id = @p1
  `;
  await safeQuery(sql, [
    floorId,
    floorNumber,
    rows,
    cols,
    floorPlanImage || null,
    sortOrder,
  ]);
  revalidatePath(`/admin/projects/*`);
  return { success: true };
}

export async function deleteFloor(floorId: number) {
  // Units will be deleted via ON DELETE CASCADE (set up in DB)
  const sql = `DELETE FROM Floor WHERE id = @p1`;
  await safeQuery(sql, [floorId]);
  revalidatePath(`/admin/projects/*`);
  return { success: true };
}
