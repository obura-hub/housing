"use server";
import { auth } from "@/auth";
import { safeQuery } from "@/lib/db";

// Constants
const DEPOSIT_PERCENT = 0.1; // 10%
const DEPOSIT_DEADLINE_DAYS = 2; // 2 days

// ---------- Helpers ----------
async function getDbUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email)
    throw new Error("Unauthorized: No email in session");
  const sql = `SELECT UserId FROM [User] WHERE email = @p1`;
  const { rows } = await safeQuery(sql, [session.user.email]);
  if (rows.length === 0) throw new Error("User not found in database");
  return rows[0].UserId;
}

function normalizeStatus(status: string | null): string {
  return status ?? "pending";
}

/**
 * Cancel an expired pending reservation and release its unit.
 */
async function cancelExpiredPendingReservation(reservationId: string) {
  const cancelSql = `
    UPDATE Reservation
    SET status = 'cancelled'
    WHERE id = @p1 AND (status = 'pending' OR status IS NULL)
  `;
  await safeQuery(cancelSql, [reservationId]);

  const releaseSql = `
    UPDATE Unit
    SET is_available = 1
    WHERE id = (SELECT unit_id FROM Reservation WHERE id = @p1)
  `;
  await safeQuery(releaseSql, [reservationId]);
}

// ---------- Main Dashboard Data ----------
export async function getUserDashboardData() {
  const userId = await getDbUserId();

  // --- 1. Check for expired pending reservations ---
  const expiredCheckSql = `
    SELECT id, total_price, paid_amount, reserved_at
    FROM Reservation
    WHERE user_id = @p1
      AND (status = 'pending' OR status IS NULL)
      AND DATEDIFF(day, reserved_at, GETUTCDATE()) > @p2
      AND paid_amount < (total_price * @p3)
  `;
  const { rows: expiredRows } = await safeQuery(expiredCheckSql, [
    userId,
    DEPOSIT_DEADLINE_DAYS,
    DEPOSIT_PERCENT,
  ]);
  for (const row of expiredRows) {
    await cancelExpiredPendingReservation(row.id);
  }

  // --- 2. Fetch active reservation (including NULL status) ---
  const reservationSql = `
    SELECT TOP 1
      r.id,
      r.status,
      r.total_price,
      r.paid_amount,
      r.payment_plan,
      r.monthly_installment,
      r.next_payment_date,
      r.reserved_at,
      p.name AS project_name,
      p.location,
      ut.type AS unit_type,
      u.unit_number
    FROM Reservation r
    JOIN Unit u ON r.unit_id = u.id
    JOIN UnitType ut ON u.unit_type_id = ut.id
    JOIN Project p ON r.project_id = p.id
    WHERE r.user_id = @p1
      AND (r.status NOT IN ('cancelled', 'completed', 'owned') OR r.status IS NULL)
    ORDER BY r.reserved_at DESC
  `;
  const { rows: reservationRows } = await safeQuery(reservationSql, [userId]);
  const activeReservation = reservationRows[0] || null;

  // Normalize status for consistent usage
  if (activeReservation) {
    activeReservation.status = normalizeStatus(activeReservation.status);
    // Compute remaining amount for convenience
    activeReservation.remaining_amount =
      activeReservation.total_price - activeReservation.paid_amount;
  }

  // --- 3. Compute next payment ---
  let nextPayment = null;
  if (activeReservation) {
    const depositAmount = activeReservation.total_price * DEPOSIT_PERCENT;
    const remainingDeposit = Math.max(
      0,
      depositAmount - activeReservation.paid_amount,
    );
    const status = activeReservation.status;

    if (status === "pending") {
      if (remainingDeposit > 0) {
        const dueDate = new Date(activeReservation.reserved_at);
        dueDate.setDate(dueDate.getDate() + DEPOSIT_DEADLINE_DAYS);
        nextPayment = {
          amount: remainingDeposit,
          dueDate: dueDate.toISOString().split("T")[0],
          label: "Deposit",
        };
      } else if (activeReservation.next_payment_date) {
        // Deposit fully paid but status still pending – treat as confirmed/installment
        nextPayment = {
          amount: activeReservation.monthly_installment || 0,
          dueDate: activeReservation.next_payment_date,
          label: "Installment",
        };
      }
    } else if (status === "paying" && activeReservation.next_payment_date) {
      nextPayment = {
        amount: activeReservation.monthly_installment || 0,
        dueDate: activeReservation.next_payment_date,
        label: "Installment",
      };
    } else if (status === "confirmed" && activeReservation.next_payment_date) {
      nextPayment = {
        amount: activeReservation.monthly_installment || 0,
        dueDate: activeReservation.next_payment_date,
        label: "Installment",
      };
    }
  }

  // --- 4. Recent payments ---
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

  // --- 5. Stats ---
  const statsSql = `
    SELECT
      ISNULL(SUM(r.paid_amount), 0) AS total_paid,
      COUNT(*) AS total_reservations
    FROM Reservation r
    WHERE r.user_id = @p1
  `;
  const { rows: statsRows } = await safeQuery(statsSql, [userId]);
  const stats = statsRows[0] || { total_paid: 0, total_reservations: 0 };

  // --- 6. Balance on active booking ---
  let activeBalance = null;
  if (activeReservation) {
    activeBalance =
      activeReservation.total_price - activeReservation.paid_amount;
  }

  return {
    activeBooking: activeReservation,
    recentPayments: paymentsRows,
    stats: {
      totalPaid: stats.total_paid,
      totalReservations: stats.total_reservations,
      activeBalance: activeBalance > 0 ? activeBalance : 0,
    },
    nextPayment,
  };
}

// ---------- Other existing functions (unchanged) ----------
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
    WHERE r.user_id = @p1 AND (r.status NOT IN ('cancelled', 'completed', 'owned') OR r.status IS NULL)
    ORDER BY r.reserved_at DESC
  `;
  const { rows } = await safeQuery(sql, [userId]);
  if (rows.length > 0) rows[0].status = normalizeStatus(rows[0].status);
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
  return rows.map((row) => ({ ...row, status: normalizeStatus(row.status) }));
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

/**
 * Create a payment and update reservation paid_amount & status.
 * (Copied from paymentActions for consistency; you can also import from there)
 */
export async function createPayment(
  reservationId: number,
  amount: number,
  method: string,
  reference?: string,
) {
  const userId = await getDbUserId();

  // Insert payment
  await safeQuery(
    `INSERT INTO Payment (reservation_id, amount, method, reference, status)
     VALUES (@p1, @p2, @p3, @p4, 'completed')`,
    [reservationId, amount, method, reference],
  );

  // Update paid_amount
  await safeQuery(
    `UPDATE Reservation SET paid_amount = paid_amount + @p2
     WHERE id = @p1 AND user_id = @p5`,
    [reservationId, amount, userId],
  );

  // Check deposit and update status
  const { rows } = await safeQuery(
    `SELECT total_price, paid_amount, status
     FROM Reservation WHERE id = @p1 AND user_id = @p2`,
    [reservationId, userId],
  );
  if (rows.length > 0) {
    const res = rows[0];
    const depositAmount = res.total_price * DEPOSIT_PERCENT;
    let newStatus = res.status;

    if (res.paid_amount >= depositAmount) {
      newStatus = "confirmed";
    } else if (res.status !== "pending") {
      newStatus = "pending";
    }

    if (newStatus !== res.status) {
      await safeQuery(`UPDATE Reservation SET status = @p1 WHERE id = @p2`, [
        newStatus,
        reservationId,
      ]);
    }
  }
}
