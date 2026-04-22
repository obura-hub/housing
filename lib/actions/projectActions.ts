import { safeQuery } from "../db";

export async function getFeaturedProjects(limit: number = 3) {
  const sql = `
    SELECT TOP ${limit}
      p.id,
      p.name,
      p.location,

      p.description,
      (SELECT TOP 1 image_url FROM ProjectImage WHERE project_id = p.id ORDER BY display_order) AS coverImage
    FROM Project p
    ORDER BY p.id DESC
  `;
  const { rows } = await safeQuery(sql, []);
  return rows;
}

export async function getAllProjects() {
  const sql = `
    SELECT
      p.id,
      p.name,
      p.location,
      p.description,
      p.status,
      (SELECT TOP 1 image_url FROM ProjectImage WHERE project_id = p.id ORDER BY display_order) AS coverImage,
      (SELECT COUNT(*) FROM Unit u
       INNER JOIN Floor f ON u.floor_id = f.id
       INNER JOIN Block b ON f.block_id = b.id
       WHERE b.project_id = p.id) AS totalUnits
    FROM Project p
    ORDER BY p.id DESC
  `;
  const { rows } = await safeQuery(sql, []);
  return rows;
}

export async function getProjectDetails(id: number) {
  // 1. Project basic info (unchanged)
  const projectSql = `
    SELECT
      p.id,
      p.name,
      p.location,
      p.address,
      p.description,
      p.long_description AS longDescription,
      p.status,
      p.completion_date AS completionDate,
      p.developer,
      p.contact_email AS contactEmail,
      p.contact_phone AS contactPhone
    FROM Project p
    WHERE p.id = @p1
  `;
  const { rows: projectRows } = await safeQuery(projectSql, [id]);
  if (projectRows.length === 0) return null;
  const project = projectRows[0];

  // 2. Gallery images (unchanged)
  const imagesSql = `
    SELECT image_url AS url
    FROM ProjectImage
    WHERE project_id = @p1
    ORDER BY display_order
  `;
  const { rows: imageRows } = await safeQuery<{ url: string }>(imagesSql, [id]);
  const images = imageRows.map((row) => row.url);

  // 3. Blocks with floors and units (unchanged – already fixed)
  const blocksSql = `
    SELECT
      b.id,
      b.name,
      b.description,
      b.image_url AS image,
      b.model_3d_url AS model3d,
      (
        SELECT
          f.id,
          f.floor_number AS floorNumber,
          f.rows,
          f.cols,
          f.floor_plan_image AS floorPlanImage,
          (
            SELECT
              u.id,
              u.unit_number AS unitNumber,
              u.status,
              u.position_row AS row,
              u.position_col AS col,
              (
                SELECT
                  ut.type,
                  ut.size,
                  ut.price,
                  ut.bedrooms,
                  ut.bathrooms,
                  ut.image_url AS image,
                  ut.model_3d_url AS model3d
                FROM UnitType ut
                WHERE ut.id = u.unit_type_id
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
              ) AS unitType
            FROM Unit u
            WHERE u.floor_id = f.id
            ORDER BY u.position_row, u.position_col
            FOR JSON PATH
          ) AS units
        FROM Floor f
        WHERE f.block_id = b.id
        ORDER BY f.floor_number
        FOR JSON PATH
      ) AS floors
    FROM Block b
    WHERE b.project_id = @p1
    ORDER BY b.sort_order
  `;
  const { rows: blockRows } = await safeQuery(blocksSql, [id]);

  // Parse JSON floors and units (already safe)
  const blocks = blockRows.map((block) => {
    const floorsRaw = block.floors || "[]";
    const floorsArray =
      typeof floorsRaw === "string" ? JSON.parse(floorsRaw) : floorsRaw;
    return {
      ...block,
      floors: floorsArray.map((floor: any) => ({
        ...floor,
        units:
          typeof floor.units === "string"
            ? JSON.parse(floor.units)
            : floor.units || [],
      })),
    };
  });

  // 4. Unit types summary – FIXED (no DISTINCT, include sort_order)
  const unitTypesSql = `
    SELECT
    ut.id,
      ut.type,
      ut.size,
      ut.price,
      ut.bedrooms,
      ut.bathrooms,
      ut.image_url AS image,
      ut.model_3d_url AS model3d,
      ut.sort_order,
      (SELECT COUNT(*) FROM Unit u
       INNER JOIN Floor f ON u.floor_id = f.id
       INNER JOIN Block b ON f.block_id = b.id
       WHERE b.project_id = @p1 AND u.unit_type_id = ut.id) AS totalUnits,
      (SELECT COUNT(*) FROM Unit u
       INNER JOIN Floor f ON u.floor_id = f.id
       INNER JOIN Block b ON f.block_id = b.id
       WHERE b.project_id = @p1 AND u.unit_type_id = ut.id AND u.status = 'available') AS availableUnits
    FROM UnitType ut
    WHERE ut.project_id = @p1
    ORDER BY ut.sort_order
  `;
  const { rows: unitTypesRaw } = await safeQuery(unitTypesSql, [id]);
  // Remove sort_order from the returned objects (optional)
  const unitTypes = unitTypesRaw.map(({ sort_order, ...rest }) => rest);

  // 5. Amenities (unchanged)
  let amenities: string[] = [];
  try {
    const amenitiesSql = `SELECT amenity_name AS name FROM Amenity WHERE project_id = @p1 ORDER BY sort_order`;
    const { rows } = await safeQuery<{ name: string }>(amenitiesSql, [id]);
    amenities = rows.map((r) => r.name);
  } catch {
    /* table might not exist */
  }

  // 6. Payment plans (unchanged)
  let paymentPlans: any[] = [];
  try {
    const paymentPlansSql = `SELECT [plan], discount, description FROM PaymentPlan WHERE project_id = @p1 ORDER BY sort_order`;
    const { rows } = await safeQuery(paymentPlansSql, [id]);
    paymentPlans = rows;
  } catch {
    /* table might not exist */
  }

  return {
    ...project,
    images,
    blocks,
    unitTypes,
    amenities,
    paymentPlans,
  };
}

export async function getFloorWithUnits(floorId: number) {
  const sql = `
    SELECT
      f.id,
      f.floor_number AS floorNumber,
      f.rows,
      f.cols,
      f.floor_plan_image AS floorPlanImage,
      (
        SELECT
          u.id,
          u.unit_number AS unitNumber,
          u.status,
          u.position_row AS row,
          u.position_col AS col,
          ut.type AS unitTypeName,
          ut.price AS unitTypePrice
        FROM Unit u
        JOIN UnitType ut ON u.unit_type_id = ut.id
        WHERE u.floor_id = f.id
        ORDER BY u.position_row, u.position_col
        FOR JSON PATH
      ) AS units
    FROM Floor f
    WHERE f.id = @p1
  `;
  const { rows } = await safeQuery(sql, [floorId]);
  if (rows.length === 0) return null;
  const floor = rows[0];
  return {
    ...floor,
    units:
      typeof floor.units === "string"
        ? JSON.parse(floor.units)
        : floor.units || [],
  };
}

// unitTypeActions.ts
export async function getUnitType(id: number) {
  const sql = `
    SELECT id, type, size, price, bedrooms, bathrooms, image_url AS image, model_3d_url AS model3d
    FROM UnitType
    WHERE id = @p1
  `;
  const { rows } = await safeQuery(sql, [id]);
  return rows[0] || null;
}

// In your projectActions.ts or unitTypeActions.ts

export async function getBlocksForUnitType(
  projectId: number,
  unitTypeId: number,
) {
  const sql = `
    SELECT DISTINCT
      b.id,
      b.name,
      b.description,
      b.image_url AS image,
      b.model_3d_url AS model3d,
      b.sort_order,
      (SELECT COUNT(DISTINCT f.id) FROM Floor f WHERE f.block_id = b.id) AS floorCount,
      (SELECT COUNT(*) FROM Unit u
       JOIN Floor f ON u.floor_id = f.id
       WHERE f.block_id = b.id AND u.unit_type_id = @p2 AND u.status = 'available') AS availableUnits
    FROM Block b
    JOIN Floor f ON b.id = f.block_id
    JOIN Unit u ON f.id = u.floor_id
    WHERE b.project_id = @p1 AND u.unit_type_id = @p2
    ORDER BY b.sort_order
  `;
  const { rows } = await safeQuery(sql, [projectId, unitTypeId]);
  // Remove sort_order from returned objects
  return rows.map(({ sort_order, ...block }) => block);
}

// floorActions.ts
export async function getFloorsWithUnits(blockId: number, unitTypeId: number) {
  const sql = `
    SELECT
      f.id,
      f.floor_number AS floorNumber,
      f.rows,
      f.cols,
      f.floor_plan_image AS floorPlanImage,
      (SELECT COUNT(*) FROM Unit u WHERE u.floor_id = f.id AND u.unit_type_id = @p2 AND u.status = 'available') AS availableUnits,
      (SELECT COUNT(*) FROM Unit u WHERE u.floor_id = f.id AND u.unit_type_id = @p2) AS totalUnits
    FROM Floor f
    WHERE f.block_id = @p1
    ORDER BY f.floor_number
  `;
  const { rows } = await safeQuery(sql, [blockId, unitTypeId]);
  return rows;
}

export async function getUnitsOnFloor(floorId: number, unitTypeId: number) {
  const sql = `
    SELECT
      u.id,
      u.unit_number AS unitNumber,
      u.status,
      u.position_row AS row,
      u.position_col AS col,
      u.price_adjustment AS priceAdjustment,
      ut.price AS basePrice
    FROM Unit u
    JOIN UnitType ut ON u.unit_type_id = ut.id
    WHERE u.floor_id = @p1 AND u.unit_type_id = @p2
    ORDER BY u.position_row, u.position_col
  `;
  const { rows } = await safeQuery(sql, [floorId, unitTypeId]);
  return rows;
}

export async function getFloorDetails(floorId: number) {
  const sql = `
    SELECT
      id,
      floor_number AS floorNumber,
      rows,
      cols,
      floor_plan_image AS floorPlanImage,
      block_id AS blockId
    FROM Floor
    WHERE id = @p1
  `;
  const { rows } = await safeQuery(sql, [floorId]);
  if (rows.length === 0) return null;
  return rows[0];
}
