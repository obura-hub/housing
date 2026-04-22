"use server";

import { DatabaseError, safeQuery } from "@/lib/db";
import {
  PaymentPlan,
  Project,
  ProjectDetails,
  UnitType,
} from "@/lib/types/projectsTypes";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Fetch all projects (admin view)
export async function getAdminProjects(): Promise<Project[]> {
  const sql = `
    SELECT
      id, name, location, address, description,
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

// Add this to projectActions.ts

export async function createFullProject(data: {
  project: {
    name: string;
    location: string;
    address: string;
    description: string;
    longDescription: string;
    status: string;
    completionDate: string;
    developer: string;
    contactEmail: string;
    contactPhone: string;
    images: []; // new
  };
  blocks: Array<{
    name: string;
    description: string;
    image: string;
    model3d: string;
    sortOrder: number;
    floors: Array<{
      floorNumber: number;
      rows: number;
      cols: number;
      floorPlanImage: string;
      cells: Array<{
        row: number;
        col: number;
        unitNumber: string;
        unitTypeId: string; // reference to unitType.id
      }>;
    }>;
  }>;
  unitTypes: Array<{
    id: string; // temp client id
    type: string;
    size: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    image: string;
    model3d: string;
    sortOrder: number;
  }>;
}) {
  try {
    // Insert project
    // Insert project (without hero_image)
    const projectResult = await safeQuery(
      `
      INSERT INTO Project (
        name, location, address, description, long_description,
        status, completion_date, developer, contact_email, contact_phone
      )
      OUTPUT INSERTED.id
      VALUES (@p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10)
      `,
      [
        data.project.name,
        data.project.location,
        data.project.address,
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

    // Insert project gallery images
    if (data.project.images && data.project.images.length > 0) {
      for (let i = 0; i < data.project.images.length; i++) {
        await safeQuery(
          `
          INSERT INTO ProjectImage (project_id, image_url, display_order)
          VALUES (@p1, @p2, @p3)
          `,
          [projectId, data.project.images[i], i],
        );
      }
    }

    // Insert amenities
    if (data.project.amenities && data.project.amenities.length > 0) {
      for (let i = 0; i < data.project.amenities.length; i++) {
        await safeQuery(
          `
          INSERT INTO Amenity (project_id, amenity_name, sort_order)
          VALUES (@p1, @p2, @p3)
          `,
          [projectId, data.project.amenities[i], i],
        );
      }
    }

    // Insert payment plans
    if (data.project.paymentPlans && data.project.paymentPlans.length > 0) {
      for (let i = 0; i < data.project.paymentPlans.length; i++) {
        const plan = data.project.paymentPlans[i];
        await safeQuery(
          `
          INSERT INTO PaymentPlan (project_id, [plan], discount, description, sort_order)
          VALUES (@p1, @p2, @p3, @p4, @p5)
          `,
          [projectId, plan.plan, plan.discount, plan.description, i],
        );
      }
    }

    // Insert unit types and map temp ids to real ids
    const unitTypeMap = new Map<string, number>();
    for (const ut of data.unitTypes) {
      const result = await safeQuery(
        `
        INSERT INTO UnitType (
          project_id, type, size, price, bedrooms, bathrooms,
          image_url, model_3d_url, sort_order
        )
        OUTPUT INSERTED.id
        VALUES (@p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9)
        `,
        [
          projectId,
          ut.type,
          ut.size,
          ut.price,
          ut.bedrooms,
          ut.bathrooms,
          ut.image || null,
          ut.model3d || null,
          ut.sortOrder,
        ],
      );
      unitTypeMap.set(ut.id, result.rows[0].id);
    }

    // Insert blocks, floors, units
    for (let bIdx = 0; bIdx < data.blocks.length; bIdx++) {
      const block = data.blocks[bIdx];
      const blockResult = await safeQuery(
        `
        INSERT INTO Block (
          project_id, name, description, image_url, model_3d_url, sort_order
        )
        OUTPUT INSERTED.id
        VALUES (@p1, @p2, @p3, @p4, @p5, @p6)
        `,
        [
          projectId,
          block.name,
          block.description || "",
          block.image || null,
          block.model3d || null,
          block.sortOrder ?? bIdx,
        ],
      );
      const blockId = blockResult.rows[0].id;

      for (let fIdx = 0; fIdx < block.floors.length; fIdx++) {
        const floor = block.floors[fIdx];
        const floorResult = await safeQuery(
          `
          INSERT INTO Floor (
            block_id, floor_number, rows, cols, floor_plan_image, sort_order
          )
          OUTPUT INSERTED.id
          VALUES (@p1, @p2, @p3, @p4, @p5, @p6)
          `,
          [
            blockId,
            floor.floorNumber,
            floor.rows,
            floor.cols,
            floor.floorPlanImage || null,
            fIdx,
          ],
        );
        const floorId = floorResult.rows[0].id;

        for (const cell of floor.cells) {
          const unitTypeId = unitTypeMap.get(cell.unitTypeId);
          if (!unitTypeId) continue;

          await safeQuery(
            `
            INSERT INTO Unit (
              floor_id, unit_type_id, unit_number, status,
              position_row, position_col
            )
            VALUES (@p1, @p2, @p3, @p4, @p5, @p6)
            `,
            [
              floorId,
              unitTypeId,
              cell.unitNumber,
              "available",
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

// Get full project details by ID
export async function getProjectById(
  id: number,
): Promise<ProjectDetails | undefined> {
  try {
    // 1. Fetch main project data (without units)
    const projectSql = `
      SELECT TOP 1
        id,
        name,
        location,
        address,

        description,
        long_description AS longDescription,
        status,
        completion_date AS completionDate,
        developer,
        contact_email AS contactEmail,
        contact_phone AS contactPhone
      FROM Project
      WHERE id = @p1
    `;
    const { rows: projectRows } = await safeQuery<any>(projectSql, [id]);
    if (projectRows.length === 0) return undefined;
    const project = projectRows[0];

    // 2. Fetch gallery images
    const imagesSql = `
      SELECT image_url AS url
      FROM ProjectImage
      WHERE project_id = @p1
      ORDER BY display_order
    `;
    const { rows: imageRows } = await safeQuery<{ url: string }>(imagesSql, [
      id,
    ]);
    const images = imageRows.map((row) => row.url);

    // 3. Fetch floor plan images from all floors of all blocks
    const floorPlanSql = `
      SELECT DISTINCT f.floor_plan_image AS url
      FROM Floor f
      INNER JOIN Block b ON f.block_id = b.id
      WHERE b.project_id = @p1 AND f.floor_plan_image IS NOT NULL
      ORDER BY f.floor_plan_image
    `;
    const { rows: floorPlanRows } = await safeQuery<{ url: string }>(
      floorPlanSql,
      [id],
    );
    const floorPlanImages = floorPlanRows.map((row) => row.url);

    // 4. Fetch a representative 3D model (first block model, or first unit type model)
    let model3dUrl: string | null = null;
    // Try block models first
    const blockModelSql = `
      SELECT TOP 1 model_3d_url AS url
      FROM Block
      WHERE project_id = @p1 AND model_3d_url IS NOT NULL
    `;
    const { rows: blockModelRows } = await safeQuery<{ url: string }>(
      blockModelSql,
      [id],
    );
    if (blockModelRows.length > 0) {
      model3dUrl = blockModelRows[0].url;
    } else {
      // Fallback to unit type models
      const unitTypeModelSql = `
        SELECT TOP 1 model_3d_url AS url
        FROM UnitType
        WHERE project_id = @p1 AND model_3d_url IS NOT NULL
      `;
      const { rows: unitTypeModelRows } = await safeQuery<{ url: string }>(
        unitTypeModelSql,
        [id],
      );
      if (unitTypeModelRows.length > 0) {
        model3dUrl = unitTypeModelRows[0].url;
      }
    }

    // 5. Calculate total units from floors (rows * cols per floor)
    const unitsSql = `
      SELECT SUM(f.rows * f.cols) AS total_units
      FROM Floor f
      INNER JOIN Block b ON f.block_id = b.id
      WHERE b.project_id = @p1
    `;
    const { rows: unitsRows } = await safeQuery<{ total_units: number | null }>(
      unitsSql,
      [id],
    );
    const totalUnits = unitsRows[0]?.total_units ?? 0;

    // 6. Fetch unit types
    const unitTypesSql = `
      SELECT
        type,
        size,
        price,
        bedrooms,
        bathrooms,
        image_url AS image,
        model_3d_url AS model3d
      FROM UnitType
      WHERE project_id = @p1
      ORDER BY sort_order
    `;
    const { rows: unitTypeRows } = await safeQuery<UnitType>(unitTypesSql, [
      id,
    ]);

    // 7. Fetch amenities (if table exists)
    let amenities: string[] = [];
    try {
      const amenitiesSql = `
        SELECT amenity_name AS amenity
        FROM Amenity
        WHERE project_id = @p1
        ORDER BY sort_order
      `;
      const { rows: amenityRows } = await safeQuery<{ amenity: string }>(
        amenitiesSql,
        [id],
      );
      amenities = amenityRows.map((row) => row.amenity);
    } catch {
      // Table might not exist yet – ignore
    }

    // 8. Fetch payment plans (if table exists)
    let paymentPlans: PaymentPlan[] = [];
    try {
      const paymentPlansSql = `
        SELECT
          [plan],
          discount,
          description
        FROM PaymentPlan
        WHERE project_id = @p1
        ORDER BY sort_order
      `;
      const { rows: paymentPlanRows } = await safeQuery<PaymentPlan>(
        paymentPlansSql,
        [id],
      );
      paymentPlans = paymentPlanRows;
    } catch {
      // Table might not exist – ignore
    }

    // Build the full project details object
    return {
      id: project.id,
      name: project.name,
      location: project.location,
      address: project.address,
      units: totalUnits, // calculated, not from DB column
      price: project.price,
      description: project.description,
      longDescription: project.longDescription,
      coverImage: images[0] || "",
      images,
      floorPlanImages, // new field
      model3dUrl, // new field
      unitTypes: unitTypeRows,
      amenities,
      paymentPlans,
      status: project.status,
      completionDate: project.completionDate,
      developer: project.developer,
      contact: {
        email: project.contactEmail,
        phone: project.contactPhone,
      },
    };
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    console.error("Failed to fetch project details:", error);
    throw new Error("Failed to fetch project details");
  }
}

export async function getProjectImages(projectId: number) {
  const sql = `
    SELECT id, image_url AS url, display_order
    FROM ProjectImage
    WHERE project_id = @p1
    ORDER BY display_order
  `;
  const { rows } = await safeQuery(sql, [projectId]);
  return rows;
}

export async function addProjectImage(projectId: number, imageUrl: string) {
  // Get current max display_order
  const maxSql = `SELECT ISNULL(MAX(display_order), -1) AS maxOrder FROM ProjectImage WHERE project_id = @p1`;
  const { rows } = await safeQuery(maxSql, [projectId]);
  const newOrder = rows[0].maxOrder + 1;

  const sql = `
    INSERT INTO ProjectImage (project_id, image_url, display_order)
    VALUES (@p1, @p2, @p3)
  `;
  await safeQuery(sql, [projectId, imageUrl, newOrder]);
  revalidatePath(`/admin/projects/${projectId}/edit/images`);
  return { success: true };
}

export async function deleteProjectImage(imageId: number) {
  const sql = `DELETE FROM ProjectImage WHERE id = @p1`;
  await safeQuery(sql, [imageId]);
  revalidatePath(`/admin/projects/*`);
  return { success: true };
}

export async function reorderProjectImages(
  projectId: number,
  imageIds: number[],
) {
  for (let i = 0; i < imageIds.length; i++) {
    const sql = `UPDATE ProjectImage SET display_order = @p1 WHERE id = @p2 AND project_id = @p3`;
    await safeQuery(sql, [i, imageIds[i], projectId]);
  }
  revalidatePath(`/admin/projects/${projectId}/edit/images`);
  return { success: true };
}

export async function updateProjectDetails(
  projectId: number,
  formData: FormData,
) {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const address = formData.get("address") as string;
  const description = formData.get("description") as string;
  const longDescription = formData.get("longDescription") as string;
  const status = formData.get("status") as string;
  const completionDate = formData.get("completionDate") as string;
  const developer = formData.get("developer") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const amenities = JSON.parse((formData.get("amenities") as string) || "[]");
  const paymentPlans = JSON.parse(
    (formData.get("paymentPlans") as string) || "[]",
  );

  // Update project
  const sql = `
    UPDATE Project SET
      name = @p2,
      location = @p3,
      address = @p4,
      description = @p5,
      long_description = @p6,
      status = @p7,
      completion_date = @p8,
      developer = @p9,
      contact_email = @p10,
      contact_phone = @p11
    WHERE id = @p1
  `;
  await safeQuery(sql, [
    projectId,
    name,
    location,
    address,
    description,
    longDescription,
    status,
    completionDate,
    developer,
    contactEmail,
    contactPhone,
  ]);

  // Replace amenities (delete old, insert new)
  await safeQuery(`DELETE FROM Amenity WHERE project_id = @p1`, [projectId]);
  for (let i = 0; i < amenities.length; i++) {
    await safeQuery(
      `INSERT INTO Amenity (project_id, amenity_name, sort_order) VALUES (@p1, @p2, @p3)`,
      [projectId, amenities[i], i],
    );
  }

  // Replace payment plans
  await safeQuery(`DELETE FROM PaymentPlan WHERE project_id = @p1`, [
    projectId,
  ]);
  for (let i = 0; i < paymentPlans.length; i++) {
    const plan = paymentPlans[i];
    await safeQuery(
      `INSERT INTO PaymentPlan (project_id, [plan], discount, description, sort_order) VALUES (@p1, @p2, @p3, @p4, @p5)`,
      [projectId, plan.plan, plan.discount, plan.description, i],
    );
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/admin/projects`);
  return { success: true };
}
