"use server";

import { DatabaseError, safeQuery } from "../db";
import {
  Project,
  ProjectDetails,
  UnitType,
  PaymentPlan,
} from "../types/projectsTypes";

// Get list of projects with cover image
export async function getProjects(): Promise<Project[]> {
  try {
    const sql = `
      SELECT
        p.id,
        p.name,
        p.location,
        p.units,
        p.price,
        p.description,
        (
          SELECT TOP 1 pi.image_url
          FROM ProjectImage pi
          WHERE pi.project_id = p.id
          ORDER BY pi.display_order
        ) AS coverImage
      FROM Project p
      ORDER BY p.id DESC
    `;

    const { rows } = await safeQuery<Project>(sql, []);
    return rows;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    console.error("Failed to fetch projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

// Get full project details by ID
export async function getProjectById(
  id: number,
): Promise<ProjectDetails | undefined> {
  try {
    // 1. Fetch main project data
    const projectSql = `
      SELECT TOP 1
        id,
        name,
        location,
        address,
        units,
        price,
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

    // 2. Fetch all images
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

    // 3. Fetch unit types
    const unitTypesSql = `
      SELECT
        type,
        size,
        price,
        bedrooms,
        bathrooms
      FROM UnitType
      WHERE project_id = @p1
      ORDER BY sort_order
    `;
    const { rows: unitTypeRows } = await safeQuery<UnitType>(unitTypesSql, [
      id,
    ]);

    // 4. Fetch amenities
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
    const amenities = amenityRows.map((row) => row.amenity);

    // 5. Fetch payment plans
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

    // Build the full project details object
    return {
      id: project.id,
      name: project.name,
      location: project.location,
      address: project.address,
      units: project.units,
      price: project.price,
      description: project.description,
      longDescription: project.longDescription,
      coverImage: images[0] || "", // Use the first image as cover
      images,
      unitTypes: unitTypeRows,
      amenities,
      paymentPlans: paymentPlanRows,
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
