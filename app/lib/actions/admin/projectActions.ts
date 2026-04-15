"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeQuery } from "@/app/lib/db";
import { Project } from "@/app/lib/types/projectsTypes";
import { UnitType } from "@/app/lib/types/projectsTypes";

// Fetch all projects (admin view)
export async function getAdminProjects(): Promise<Project[]> {
  const sql = `
    SELECT
      id, name, location, address, units, price, description,
      long_description AS longDescription, status, completion_date AS completionDate,
      developer, contact_email AS contactEmail, contact_phone AS contactPhone
    FROM Project
    ORDER BY id DESC
  `;
  const { rows } = await safeQuery<Project>(sql, []);
  return rows;
}

// Create new project
export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const address = formData.get("address") as string;
  const units = parseInt(formData.get("units") as string);
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const longDescription = formData.get("longDescription") as string;
  const status = formData.get("status") as string;
  const completionDate = formData.get("completionDate") as string;
  const developer = formData.get("developer") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const contactPhone = formData.get("contactPhone") as string;

  const sql = `
    INSERT INTO Project (
      name, location, address, units, price, description, long_description,
      status, completion_date, developer, contact_email, contact_phone
    )
    OUTPUT INSERTED.id
    VALUES (@p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10, @p11, @p12)
  `;
  const result = await safeQuery<{ id: number }>(sql, [
    name,
    location,
    address,
    units,
    price,
    description,
    longDescription,
    status,
    completionDate,
    developer,
    contactEmail,
    contactPhone,
  ]);
  const id = result.rows[0].id;

  // Optional: handle amenities, unit types, payment plans, images – we'll do that later
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${id}/edit`);
}

// Update project
export async function updateProject(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const address = formData.get("address") as string;
  const units = parseInt(formData.get("units") as string);
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const longDescription = formData.get("longDescription") as string;
  const status = formData.get("status") as string;
  const completionDate = formData.get("completionDate") as string;
  const developer = formData.get("developer") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const contactPhone = formData.get("contactPhone") as string;

  const sql = `
    UPDATE Project SET
      name = @p2, location = @p3, address = @p4, units = @p5, price = @p6,
      description = @p7, long_description = @p8, status = @p9, completion_date = @p10,
      developer = @p11, contact_email = @p12, contact_phone = @p13
    WHERE id = @p1
  `;
  await safeQuery(sql, [
    id,
    name,
    location,
    address,
    units,
    price,
    description,
    longDescription,
    status,
    completionDate,
    developer,
    contactEmail,
    contactPhone,
  ]);

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  redirect(`/admin/projects/${id}`);
}

// Delete project
export async function deleteProject(id: number) {
  // Cascade delete should handle related records (if foreign keys with ON DELETE CASCADE)
  await safeQuery(`DELETE FROM Project WHERE id = @p1`, [id]);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function createFullProject(data: {
  project: any;
  blocks: Array<{
    name: string;
    description?: string;
    sortOrder?: number;
    floors: Array<{
      floorNumber: number;
      rows: number;
      cols: number;
      cells: Array<{
        row: number;
        col: number;
        unitNumber: string;
        unitType: any;
      }>;
    }>;
  }>;
  unitTypes: any[];
}) {
  try {
    // Insert project
    const projectResult = await safeQuery(
      `
      INSERT INTO Project (
        name, location, address, units, price, description, long_description,
        status, completion_date, developer, contact_email, contact_phone
      )
      OUTPUT INSERTED.id
      VALUES (@p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10, @p11, @p12)
      `,
      [
        data.project.name,
        data.project.location,
        data.project.address,
        data.project.units,
        data.project.price,
        data.project.description || "",
        data.project.longDescription || "",
        data.project.status,
        data.project.completionDate || null,
        data.project.developer || "",
        data.project.contactEmail || "",
        data.project.contactPhone || "",
      ],
    );
    const projectId = projectResult.rows[0].id;

    // Insert images
    if (data.project.images && data.project.images.length > 0) {
      for (let i = 0; i < data.project.images.length; i++) {
        const imageUrl = data.project.images[i];
        await safeQuery(
          `
          INSERT INTO ProjectImage (project_id, image_url, display_order)
          VALUES (@p1, @p2, @p3)
          `,
          [projectId, imageUrl, i],
        );
      }
    }

    // Insert unit types and store mapping
    const unitTypeMap = new Map<string, number>();
    for (const ut of data.unitTypes) {
      const result = await safeQuery(
        `
        INSERT INTO UnitType (project_id, type, size, price, bedrooms, bathrooms, sort_order)
        OUTPUT INSERTED.id
        VALUES (@p1, @p2, @p3, @p4, @p5, @p6, @p7)
        `,
        [
          projectId,
          ut.type,
          ut.size,
          ut.price,
          ut.bedrooms,
          ut.bathrooms,
          ut.sortOrder ?? 0,
        ],
      );
      unitTypeMap.set(JSON.stringify(ut), result.rows[0].id);
    }

    // For each block
    for (let bIdx = 0; bIdx < data.blocks.length; bIdx++) {
      const block = data.blocks[bIdx];
      const blockResult = await safeQuery(
        `
        INSERT INTO Block (project_id, name, description, sort_order)
        OUTPUT INSERTED.id
        VALUES (@p1, @p2, @p3, @p4)
        `,
        [
          projectId,
          block.name,
          block.description || "",
          block.sortOrder ?? bIdx,
        ],
      );
      const blockId = blockResult.rows[0].id;

      // For each floor in block
      for (let fIdx = 0; fIdx < block.floors.length; fIdx++) {
        const floor = block.floors[fIdx];
        const floorResult = await safeQuery(
          `
          INSERT INTO Floor (block_id, floor_number, layout_config, sort_order)
          OUTPUT INSERTED.id
          VALUES (@p1, @p2, @p3, @p4)
          `,
          [
            blockId,
            floor.floorNumber,
            JSON.stringify({ rows: floor.rows, cols: floor.cols }),
            fIdx,
          ],
        );
        const floorId = floorResult.rows[0].id;

        // For each cell, insert unit
        for (const cell of floor.cells) {
          if (!cell.unitType) continue;

          // Look up unit type ID from map
          const key = JSON.stringify(cell.unitType);
          let unitTypeId = unitTypeMap.get(key);

          // If not found (e.g., unit type not pre‑defined), create it on the fly
          if (!unitTypeId) {
            const utResult = await safeQuery(
              `
              INSERT INTO UnitType (project_id, type, size, price, bedrooms, bathrooms, sort_order)
              OUTPUT INSERTED.id
              VALUES (@p1, @p2, @p3, @p4, @p5, @p6, @p7)
              `,
              [
                projectId,
                cell.unitType.type,
                cell.unitType.size,
                cell.unitType.price,
                cell.unitType.bedrooms,
                cell.unitType.bathrooms,
                0,
              ],
            );
            unitTypeId = utResult.rows[0].id;
            unitTypeMap.set(key, unitTypeId);
          }

          await safeQuery(
            `
            INSERT INTO Unit (floor_id, unit_type_id, unit_number, status, price_adjustment, position_row, position_col)
            VALUES (@p1, @p2, @p3, @p4, @p5, @p6, @p7)
            `,
            [
              floorId,
              unitTypeId,
              cell.unitNumber,
              "available",
              0,
              cell.row,
              cell.col,
            ],
          );
        }
      }
    }

    revalidatePath("/admin/projects");
    return { success: true, projectId };
  } catch (error) {
    console.error("Failed to create full project:", error);
    return { success: false, error: "Failed to create project" };
  }
}
