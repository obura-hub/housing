"use server";

import { DatabaseError, safeQuery } from "../db";
import { PaymentPlan, ProjectDetails, UnitType } from "../types/projectsTypes";

export async function getProjectDetails(
  id: number,
): Promise<ProjectDetails | undefined> {
  try {
    // Fetch project basic info
    const projectSql = `
      SELECT
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

    // Fetch images
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

    // Fetch unit types
    const unitTypesSql = `
      SELECT
        id as unitTypeId,
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

    // Fetch amenities
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

    // Fetch payment plans
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

    return {
      id: project.id,
      name: project.name,
      location: project.location,
      address: project.address,
      units: project.units,
      price: project.price,
      description: project.description,
      longDescription: project.longDescription,
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
