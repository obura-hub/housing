'use server';

import { DatabaseError, safeQuery } from '../db';

// ─── Types ────────────────────────────────────────────────────────────────────

type IdType = 'national-id' | 'personal-no';

interface RegisteredUser {
  UserId: string;
  PhoneNumber: string;
}

interface LookupResult {
  success: true;
  maskedPhone: string;
  sessionToken: string;
  demoOtp: string; // TODO: remove in production
}

interface VerifyOtpResult {
  success: true;
  redirectPath: string;
}

type ActionError = {
  success: false;
  error: string;
};

// ─── In-memory OTP store (replace with [OtpSession] DB table in production) ──

const otpStore = new Map<
  string,
  { otp: string; userId: string; expiresAt: number }
>();

// ─── Demo OTP ─────────────────────────────────────────────────────────────────
// TODO: remove DEMO_OTP in production and switch to generateOtp() below.

/** Fixed OTP used during development/testing only. Remove before going live. */
const DEMO_OTP = '123456';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Mask all but the last 3 digits of a phone number. */
function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const prefix = digits.slice(0, Math.max(0, digits.length - 3)).replace(/\d/g, '*');
  const suffix = digits.slice(-3);
  return `+${prefix}${suffix}`;
}

/**
 * Generate a cryptographically random 6-digit OTP.
 * TODO: uncomment and use this in production instead of DEMO_OTP.
 */
// function generateOtp(): string {
//   const array = new Uint32Array(1);
//   crypto.getRandomValues(array);
//   return String(array[0] % 1_000_000).padStart(6, '0');
// }

/** Generate a cryptographically random opaque session token (hex). */
function generateSessionToken(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('hex');
}

/**
 * Send OTP via SMS using your provider (Twilio, Africa's Talking, etc.)
 * TODO: uncomment and implement before going live.
 */
// async function sendSms(phoneNumber: string, otp: string): Promise<void> {
//   console.log(`[SMS] Sending OTP ${otp} to ${phoneNumber}`);
//   // Example with Africa's Talking:
//   // await africastalking.SMS.send({ to: phoneNumber, message: `Your OTP is ${otp}` });
//   //
//   // Example with Twilio:
//   // await twilioClient.messages.create({ to: phoneNumber, from: process.env.TWILIO_NUMBER, body: `Your OTP is ${otp}` });
// }

// ─── Server Actions ───────────────────────────────────────────────────────────

/**
 * Step 1 – Look up the user by their ID / personal number and date of birth.
 * On success, stores the demo OTP server-side and returns a session token.
 *
 * TODO (production):
 *  - Replace DEMO_OTP with generateOtp()
 *  - Uncomment sendSms() call
 *  - Remove demoOtp from the return value
 */
export async function lookupUserAndSendOtp(
  idType: IdType,
  idNumber: string,
  dob: string, // DD/MM/YYYY
): Promise<LookupResult | ActionError> {
  try {
    // Convert DD/MM/YYYY → YYYY-MM-DD for SQL DATE comparison
    const [day, month, year] = dob.split('/');
    const isoDate = `${year}-${month}-${day}`;

    const idColumn =
      idType === 'national-id' ? 'u.NationalIdNumber' : 'u.PersonalNumber';

    const sql = `
      SELECT TOP 1
        u.UserId,
        u.PhoneNumber
      FROM [User] u
      WHERE ${idColumn}                 = @p1
        AND CAST(u.DateOfBirth AS DATE) = @p2
        AND u.Status                    = 'active'`;

    const { rows } = await safeQuery<RegisteredUser>(sql, [idNumber, isoDate]);

    if (!rows[0]) {
      // Generic message – do not reveal whether the ID or the DOB was wrong
      return {
        success: false,
        error:
          'We could not find an account matching those details. Please check your information and try again.',
      };
    }

    const { UserId: userId, PhoneNumber: phoneNumber } = rows[0];

    // Use the fixed demo OTP for testing
    // TODO: replace with → const otp = generateOtp();
    const otp = DEMO_OTP;
    const sessionToken = generateSessionToken();

    // Store OTP in memory (valid for 10 minutes)
    otpStore.set(sessionToken, {
      otp,
      userId,
      expiresAt: Date.now() + 10 * 60 * 1_000,
    });

    // TODO: uncomment when SMS provider is configured
    // sendSms(phoneNumber, otp).catch((err) =>
    //   console.error('SMS delivery failed:', err),
    // );

    console.log(`[DEV] OTP for ${phoneNumber}: ${otp}`); // remove in production

    return {
      success: true,
      maskedPhone: maskPhone(phoneNumber),
      sessionToken,
      demoOtp: otp, // TODO: remove in production
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      return {
        success: false,
        error: 'We are experiencing a technical issue. Please try again later.',
      };
    }
    console.error('lookupUserAndSendOtp failed:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Step 1b – Resend OTP using an existing session token.
 *
 * TODO (production):
 *  - Replace DEMO_OTP with generateOtp()
 *  - Uncomment sendSms() call
 *  - Remove demoOtp from the return value
 */
export async function resendOtp(
  sessionToken: string,
): Promise<{ success: true; demoOtp: string } | ActionError> {
  try {
    const stored = otpStore.get(sessionToken);
    if (!stored) {
      return { success: false, error: 'Session expired. Please start again.' };
    }

    // Re-fetch phone number from DB
    const sql = `
      SELECT TOP 1 u.PhoneNumber
      FROM [User] u
      WHERE u.UserId = @p1`;

    const { rows } = await safeQuery<{ PhoneNumber: string }>(sql, [stored.userId]);

    if (!rows[0]) {
      return { success: false, error: 'User not found.' };
    }

    // Refresh with demo OTP and reset expiry
    // TODO: replace with → const newOtp = generateOtp();
    const newOtp = DEMO_OTP;

    otpStore.set(sessionToken, {
      ...stored,
      otp: newOtp,
      expiresAt: Date.now() + 10 * 60 * 1_000,
    });

    // TODO: uncomment when SMS provider is configured
    // sendSms(rows[0].PhoneNumber, newOtp).catch((err) =>
    //   console.error('SMS delivery failed:', err),
    // );

    console.log(`[DEV] Resent OTP for ${rows[0].PhoneNumber}: ${newOtp}`); // remove in production

    return { success: true, demoOtp: newOtp }; // TODO: remove demoOtp in production
  } catch (error) {
    if (error instanceof DatabaseError) {
      return {
        success: false,
        error: 'We are experiencing a technical issue. Please try again later.',
      };
    }
    console.error('resendOtp failed:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Step 2 – Verify the OTP the user entered.
 * On success, stamps LastLoginAt and returns the redirect path.
 */
export async function verifyOtp(
  sessionToken: string,
  otp: string,
): Promise<VerifyOtpResult | ActionError> {
  try {
    const stored = otpStore.get(sessionToken);

    if (!stored) {
      return {
        success: false,
        error: 'Session expired or not found. Please start again.',
      };
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(sessionToken);
      return {
        success: false,
        error: 'Your OTP has expired. Please request a new one.',
      };
    }

    if (otp.trim() !== stored.otp) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }

    // OTP is valid – clean up the store
    otpStore.delete(sessionToken);

    // Stamp last login (non-fatal if it fails)
    const updateSql = `
      UPDATE [User]
      SET LastLoginAt = GETUTCDATE()
      WHERE UserId = @p1`;

    await safeQuery(updateSql, [stored.userId]).catch((err) =>
      console.error('Failed to update LastLoginAt:', err),
    );

    return { success: true, redirectPath: '/projects' };
  } catch (error) {
    console.error('verifyOtp failed:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
