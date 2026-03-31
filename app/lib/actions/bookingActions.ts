"use server";

import { DatabaseError, safeQuery } from "../db";
import { z } from "zod";

const bookingSchema = z.object({
  unitId: z.number(),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  idNumber: z.string().optional(),
  paymentMethod: z.enum(["mpesa", "card", "bank"]),
  depositAmount: z.number().positive(),
});

export async function createBooking(data: z.infer<typeof bookingSchema>) {
  try {
    // Validate
    const validated = bookingSchema.parse(data);

    // Insert into Bookings table (need to create it)
    const sql = `
      INSERT INTO Booking (unit_id, full_name, email, phone, id_number, payment_method, deposit_amount, status, created_at)
      VALUES (@p1, @p2, @p3, @p4, @p5, @p6, @p7, 'pending', GETDATE())
      SELECT SCOPE_IDENTITY() AS id
    `;
    const { rows } = await safeQuery<{ id: number }>(sql, [
      validated.unitId,
      validated.fullName,
      validated.email,
      validated.phone,
      validated.idNumber || null,
      validated.paymentMethod,
      validated.depositAmount,
    ]);
    const bookingId = rows[0].id;

    // Optionally update unit status to 'reserved' (but maybe after payment)
    // await safeQuery("UPDATE Unit SET status = 'reserved' WHERE id = @p1", [validated.unitId]);

    return { success: true, bookingId };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    console.error("Failed to create booking:", error);
    return { success: false, message: "Failed to create booking" };
  }
}
