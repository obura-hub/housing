'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { lookupUserAndSendOtp, resendOtp, verifyOtp } from '../lib/actions/registerActions';



type Step = 'enter-id' | 'verify-otp';

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('enter-id');
  const [idType, setIdType] = useState<'national-id' | 'personal-no'>('national-id');
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
  const [otp, setOtp] = useState('');

  // Returned from the server after a successful lookup
  const [sessionToken, setSessionToken] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // ── DOB input formatting ──────────────────────────────────────────────────

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length >= 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
    if (value.length <= 10) setDob(value);
  };

  const validateDob = (dobString: string): boolean =>
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dobString);

  const parseDob = (dobString: string): Date | null => {
    const [d, m, y] = dobString.split('/').map(Number);
    if (!d || !m || !y) return null;
    const date = new Date(y, m - 1, d);
    return date.getDate() === d && date.getMonth() === m - 1 && date.getFullYear() === y
      ? date
      : null;
  };

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!idNumber.trim()) { setError('Please enter your ID or personal number.'); return; }
    if (!dob.trim())       { setError('Please enter your date of birth.'); return; }
    if (!validateDob(dob)) {
      setError('Please enter a valid date of birth in DD/MM/YYYY format (e.g., 15/03/1990).');
      return;
    }

    const dobDate = parseDob(dob);
    if (!dobDate) { setError('Please enter a valid date of birth.'); return; }
    if (dobDate > new Date()) { setError('Date of birth cannot be in the future.'); return; }

    // Age check
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
    if (age < 18) { setError('You must be at least 18 years old to register.'); return; }

    setIsSending(true);
    try {
      const result = await lookupUserAndSendOtp(idType, idNumber, dob);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSessionToken(result.sessionToken);
      setMaskedPhone(result.maskedPhone);
      setStep('verify-otp');
      setInfo(`A one-time password has been sent to ${result.maskedPhone}.`);
    } finally {
      setIsSending(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim()) { setError('Please enter the OTP sent to your phone.'); return; }

    setIsVerifying(true);
    try {
      const result = await verifyOtp(sessionToken, otp);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(result.redirectPath);
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────

  const handleResendOtp = async () => {
    setError(null);
    setInfo(null);
    setOtp('');

    const result = await resendOtp(sessionToken);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setInfo(`A new OTP has been sent to ${maskedPhone}.`);
  };

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Get Started</h1>
              <p className="text-gray-700 text-center mb-6">
                Enter your details to receive a one-time password (OTP) on your registered phone number.
              </p>

              {/* ── Step 1: Enter ID + DOB ── */}
              {step === 'enter-id' && (
                <form className="space-y-6" onSubmit={handleSendOtp}>
                  {/* ID Type */}
                  <div>
                    <p className="block text-sm font-medium text-gray-900 mb-2">
                      Select Identification Type
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(['national-id', 'personal-no'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setIdType(type)}
                          className={`rounded-lg border px-4 py-3 text-sm font-medium text-left transition-colors ${
                            idType === type
                              ? 'border-[#16a34a] bg-[#e5f9ed] text-[#166534]'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {type === 'national-id' ? 'National ID Number' : 'Personal Number'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ID / Personal Number */}
                  <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium text-gray-900 mb-2">
                      {idType === 'national-id' ? 'National ID Number' : 'Personal Number'}
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                      placeholder={idType === 'national-id' ? 'Enter your ID number' : 'Enter your personal number'}
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-900 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="dob"
                      value={dob}
                      onChange={handleDobChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent font-mono text-lg tracking-wider"
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Format: DD/MM/YYYY (e.g., 15/03/1990). Must match your registered date of birth.
                    </p>
                  </div>

                  <ErrorBanner message={error} />
                  <InfoBanner message={info} />

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#166534] transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSending ? 'Sending OTP…' : 'Send OTP'}
                  </button>

                  {/* Security notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                    <div className="flex items-start gap-3">
                      <LockIcon />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Two-Factor Authentication</p>
                        <p className="text-xs text-blue-700">
                          For your security, we verify your identity using both your date of birth and a
                          one-time password sent to your registered phone number.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* ── Step 2: Verify OTP ── */}
              {step === 'verify-otp' && (
                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                  {/* Summary */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 mb-2">Verification Details:</p>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><span className="font-medium">ID Type:</span> {idType === 'national-id' ? 'National ID' : 'Personal Number'}</p>
                      <p><span className="font-medium">ID Number:</span> {idNumber}</p>
                      <p><span className="font-medium">Date of Birth:</span> {dob}</p>
                      <p><span className="font-medium">OTP sent to:</span> {maskedPhone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700 mb-2">
                      We have sent a one-time password to {maskedPhone}.
                    </p>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-900 mb-2">
                      Enter OTP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent tracking-[0.3em] text-center text-lg font-semibold"
                      placeholder="••••••"
                      maxLength={6}
                      inputMode="numeric"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Check your phone for the 6-digit code</p>
                  </div>

                  <ErrorBanner message={error} />
                  <InfoBanner message={info} />

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#166534] transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? 'Verifying…' : 'Verify & Login'}
                  </button>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('enter-id');
                        setOtp('');
                        setSessionToken('');
                        setMaskedPhone('');
                        setInfo(null);
                        setError(null);
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Change Details
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="flex-1 px-6 py-3 border border-[#16a34a] text-[#16a34a] rounded-lg hover:bg-[#e5f9ed] transition-colors text-sm font-medium"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Didn&apos;t receive the code?{' '}
                      <button
                        type="button"
                        className="text-[#16a34a] hover:text-[#166534] font-medium"
                        onClick={() => setInfo('Please check your phone or contact support if the issue persists.')}
                      >
                        Get help
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
      <AlertIcon />
      <span>{message}</span>
    </div>
  );
}

function InfoBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 text-sm text-[#166534] bg-[#e5f9ed] border border-[#16a34a] rounded-md px-3 py-2">
      <InfoIcon />
      <span>{message}</span>
    </div>
  );
}

function AlertIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
