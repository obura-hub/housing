"use server";
import { auth } from "@/auth";
import { safeQuery } from "@/lib/db";

// Helper to get database UserId from session email
async function getDbUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email)
    throw new Error("Unauthorized: No email in session");
  const sql = `SELECT UserId FROM [User] WHERE email = @p1`;
  const { rows } = await safeQuery(sql, [session.user.email]);
  if (rows.length === 0) throw new Error("User not found in database");
  return rows[0].UserId;
}

export async function getUserDashboardData() {
  const userId = await getDbUserId();

  // Active reservation (status NOT in cancelled/completed/owned)
  const reservationSql = `
    SELECT TOP 1
      r.id,
      r.status,
      r.total_price,
      r.paid_amount,
      r.payment_plan,
      r.monthly_installment,
      r.next_payment_date,
      r.reserved_at AS created_at,
      p.name AS project_name,
      p.location,
      ut.type AS unit_type,
      u.unit_number
    FROM Reservation r
    JOIN Unit u ON r.unit_id = u.id
    JOIN UnitType ut ON u.unit_type_id = ut.id
    JOIN Project p ON r.project_id = p.id
    WHERE r.user_id = @p1 AND r.status NOT IN ('cancelled', 'completed', 'owned')
    ORDER BY r.reserved_at DESC
  `;
  const { rows: reservationRows } = await safeQuery(reservationSql, [userId]);
  const activeReservation = reservationRows[0] || null;

  // Recent payments (last 5)
  const paymentsSql = `
    SELECT TOP 5
      p.id,
      p.amount,
      p.payment_date,
      p.reference,
      p.status,
      p.method
    FROM Payment p
    JOIN Reservation r ON p.reservation_id = r.id
    WHERE r.user_id = @p1
    ORDER BY p.payment_date DESC
  `;
  const { rows: paymentsRows } = await safeQuery(paymentsSql, [userId]);

  // Stats
  const statsSql = `
    SELECT
      ISNULL(SUM(r.paid_amount), 0) AS total_paid,
      COUNT(*) AS total_reservations
    FROM Reservation r
    WHERE r.user_id = @p1
  `;
  const { rows: statsRows } = await safeQuery(statsSql, [userId]);

  let nextPayment = null;
  if (
    activeReservation?.next_payment_date &&
    activeReservation?.status === "paying"
  ) {
    nextPayment = {
      dueDate: activeReservation.next_payment_date,
      amount: activeReservation.monthly_installment,
    };
  }

  return {
    activeBooking: activeReservation,
    recentPayments: paymentsRows,
    stats: statsRows[0] || { total_paid: 0, total_reservations: 0 },
    nextPayment,
  };
}

export async function getUserActiveReservation() {
  const userId = await getDbUserId();
  const sql = `
    SELECT TOP 1
      r.id,
      r.status,
      p.name AS project_name,
      u.unit_number,
      ut.type AS unit_type
    FROM Reservation r
    JOIN Unit u ON r.unit_id = u.id
    JOIN UnitType ut ON u.unit_type_id = ut.id
    JOIN Project p ON r.project_id = p.id
    WHERE r.user_id = @p1 AND r.status NOT IN ('cancelled', 'completed', 'owned')
    ORDER BY r.reserved_at DESC
  `;
  const { rows } = await safeQuery(sql, [userId]);
  return rows[0] || null;
}

export async function getUserReservations() {
  const userId = await getDbUserId();
  const sql = `
    SELECT
      r.id,
      r.status,
      r.reserved_at AS createdAt,
      p.name AS project_name,
      p.location,
      ut.type AS unit_type,
      u.unit_number
    FROM Reservation r
    JOIN Unit u ON r.unit_id = u.id
    JOIN UnitType ut ON u.unit_type_id = ut.id
    JOIN Project p ON r.project_id = p.id
    WHERE r.user_id = @p1
    ORDER BY r.reserved_at DESC
  `;
  const { rows } = await safeQuery(sql, [userId]);
  return rows;
}

export async function getUserPayments() {
  const userId = await getDbUserId();
  const sql = `
    SELECT
      p.id,
      p.amount,
      p.payment_date AS createdAt,
      p.reference,
      p.status,
      p.method
    FROM Payment p
    JOIN Reservation r ON p.reservation_id = r.id
    WHERE r.user_id = @p1
    ORDER BY p.payment_date DESC
  `;
  const { rows } = await safeQuery(sql, [userId]);
  return rows;
}

export async function createPayment(
  reservationId: number,
  amount: number,
  method: string,
  reference?: string,
) {
  const userId = await getDbUserId(); // ensure user is authenticated
  const sql = `
    INSERT INTO Payment (reservation_id, amount, method, reference, status)
    VALUES (@p1, @p2, @p3, @p4, 'completed')
  `;
  await safeQuery(sql, [reservationId, amount, method, reference]);

  const updateSql = `
    UPDATE Reservation SET paid_amount = paid_amount + @p2 WHERE id = @p1 AND user_id = @p5
  `;
  await safeQuery(updateSql, [reservationId, amount, userId]);
}
